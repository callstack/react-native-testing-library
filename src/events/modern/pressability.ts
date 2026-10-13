import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { isHostTextInput } from '../../helpers/host-component-names';
import { isDisabledHostText } from '../../helpers/text';
import {
  getEventHandlerByName,
  getEventHandlerName,
  hasPressEventHandler,
} from '../shared/handler';
import { getPointerEventsBlocker } from '../shared/pointer-events';
import type { EventHandler } from '../shared/types';
import type { SyntheticEvent } from './event';
import { getEventInternals } from './event';
import type { PressabilityEventType } from './event-types';

/** Callbacks of React Native's `PressabilityConfig` that `dispatchPressabilityEvent()` calls. */
type PressabilityCallbackName = `on${Capitalize<PressabilityEventType>}`;

/** The part of React Native's `PressabilityConfig` that RNTL reads. */
type PressabilityConfig = { disabled?: boolean | null } & {
  [Name in PressabilityCallbackName]?: EventHandler | null;
};

type DispatchState = {
  /** Wrapped, so a thrown `undefined` is rethrown too. */
  firstError: { error: unknown } | null;
};

/**
 * Calls one Pressability callback (`onPress` for `press`, `onPressIn` for `pressIn`, ...) of the
 * touch responder from `findResponder()`: from its `PressabilityConfig` for `Pressable` and
 * `Touchable*`, which Pressability exposes in tests as
 * `onStartShouldSetResponder.testOnly_pressabilityConfig()`, or its own `onPress*` prop (or the
 * `testOnly_` variant) for mocked hosts. Responders without Pressability, like `PanResponder`, and
 * disabled ones get nothing.
 *
 * Doesn't negotiate the responder: callers do it once per touch, as React Native does on touch
 * start, so a touch's callbacks all go to the same responder.
 *
 * One `act()` wraps the call, and a callback error is rethrown after it. As in React Native's
 * responder system, which calls handlers directly instead of dispatching the event, `event.target`
 * is the hit target, `event.currentTarget` is the responder during the call, and `eventPhase` and
 * `composedPath()` stay unset. `onLongPress` gets a `null` `currentTarget`, as Pressability calls
 * it from a timer, after the dispatch.
 *
 * Known limitation: `testOnly_pressabilityConfig` exists only when `NODE_ENV` is `test`, which
 * Jest sets by default. Without it, `Pressable` and `Touchable*` claim the touch but get nothing.
 *
 * @param event from `createPressabilityEvent()`, passed to the callback. React Native passes the
 * same event to `onPressIn` and `onLongPress`, and another one to `onPressOut` and `onPress`.
 * @param hitTarget the first element of the touch path from `getTouchPath()`.
 * @returns `true` if a callback was called.
 */
export async function dispatchPressabilityEvent(
  responder: TestInstance,
  eventType: PressabilityEventType,
  event: SyntheticEvent,
  hitTarget: TestInstance,
): Promise<boolean> {
  if (!isInstanceMounted(responder)) {
    return false;
  }

  const callback = getPressabilityCallback(responder, eventType);
  if (callback == null) {
    return false;
  }

  const state: DispatchState = { firstError: null };
  await act(() => {
    getEventInternals(event).target = hitTarget;
    getEventInternals(event).currentTarget = eventType === 'longPress' ? null : responder;
    try {
      callback.call(responder, event);
    } catch (error) {
      state.firstError = { error };
    }

    getEventInternals(event).currentTarget = null;
  });

  // After `act()`, which would skip rendering state updates if its callback threw.
  if (state.firstError != null) {
    throw state.firstError.error;
  }

  return true;
}

/**
 * Hit testing: the elements a touch on the element goes through, from the hit target to the root.
 * The hit target is the element, or its nearest ancestor when `pointerEvents` blocks it. Empty
 * when `pointerEvents` blocks every element.
 */
export function getTouchPath(target: TestInstance): TestInstance[] {
  let hitTarget: TestInstance | null = target;
  while (hitTarget?.parent != null && getPointerEventsBlocker(hitTarget) != null) {
    hitTarget = hitTarget.parent;
  }

  const path: TestInstance[] = [];
  let current = hitTarget;
  while (current?.parent != null) {
    path.push(current);
    current = current.parent;
  }

  return path;
}

/**
 * Responder negotiation, as React Native's `ResponderEventPlugin` does on touch start:
 * `onStartShouldSetResponder` from the hit target to the root. The first one returning `true` wins.
 * A disabled `Pressable` declines, so the touch goes on to its ancestors. Called without
 * arguments, as in legacy `fireEvent` and `userEvent`.
 *
 * The Jest preset mocks `Text` and `TextInput`, so their host elements get `onPress*` props
 * instead of responder props. A host element with any of these props (or their `testOnly_`
 * variants) takes part in the negotiation as if it had Pressability. A host `TextInput` always
 * claims the touch, as its Pressability does on a device, even without these props. It calls its
 * callbacks even when not editable, as on iOS, where `editable={false}` only stops it from
 * focusing. Known difference from Android: there, a non-editable `TextInput` is disabled and never
 * the touch target, so the touch goes to its ancestors. A disabled `Text` declines the touch.
 *
 * Not implemented yet: the capture phase (`onStartShouldSetResponderCapture`), as `PanResponder`
 * reads `touchHistory` there, which only the responder system's events have.
 *
 * @param path the touch path from `getTouchPath()`.
 * @returns the first element on the path that claims the touch, or `null` when none does.
 */
export function findResponder(path: TestInstance[]): TestInstance | null {
  for (const node of path) {
    const handler = getEventHandlerByName(node.props, 'onStartShouldSetResponder');
    if (handler != null ? handler.call(node) : claimsTouchWithoutResponder(node)) {
      return node;
    }
  }

  return null;
}

/**
 * The responder's Pressability callback for the event type, e.g. `onLongPress` for `longPress`, or
 * `undefined` when it has none or is disabled.
 */
export function getPressabilityCallback(
  responder: TestInstance,
  eventType: PressabilityEventType,
): EventHandler | undefined {
  const callbackName = getEventHandlerName(eventType) as PressabilityCallbackName;
  const config = getPressabilityConfig(responder);
  if (config == null) {
    return getPressabilityEventHandler(responder, callbackName);
  }

  return config.disabled !== true ? (config[callbackName] ?? undefined) : undefined;
}

/** Config of `Pressable` and `Touchable*`, or `null` for elements without Pressability. */
function getPressabilityConfig(instance: TestInstance): PressabilityConfig | null {
  const getConfig: unknown = instance.props.onStartShouldSetResponder?.testOnly_pressabilityConfig;
  return typeof getConfig === 'function' ? (getConfig() as PressabilityConfig) : null;
}

/**
 * For mocked hosts. `TextInput` claims the touch whatever its props, as on a device, where its
 * Pressability config has no `disabled`.
 */
function claimsTouchWithoutResponder(instance: TestInstance): boolean {
  return isHostTextInput(instance) || hasPressabilityEventHandler(instance);
}

function hasPressabilityEventHandler(instance: TestInstance): boolean {
  return !isDisabledHostText(instance) && hasPressEventHandler(instance.props);
}

/**
 * Own `onPress*` prop (or its `testOnly_` variant) of an element without a Pressability config,
 * like a mocked `Text` or `TextInput` host. `undefined` for a disabled `Text`.
 */
function getPressabilityEventHandler(
  instance: TestInstance,
  eventHandlerName: string,
): EventHandler | undefined {
  if (isDisabledHostText(instance)) {
    return undefined;
  }

  return getEventHandlerByName(instance.props, eventHandlerName);
}
