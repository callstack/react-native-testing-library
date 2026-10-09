import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import { getEventHandlerName, getHandlerByName } from '../shared/handler';
import { getPointerEventsBlocker } from '../shared/pointer-events';
import type { EventHandler } from '../shared/types';
import { resetEvent } from './dispatch';
import type { SyntheticEvent } from './event';
import { getEventInternals } from './event';
import type { PressabilityEventType } from './event-types';
import { PRESSABILITY_EVENT_TYPES } from './event-types';

/** Callbacks of React Native's `PressabilityConfig` that `dispatchPressabilityEvent()` calls. */
type PressabilityCallbackName = `on${Capitalize<PressabilityEventType>}`;

/** The part of React Native's `PressabilityConfig` that `dispatchPressabilityEvent()` reads. */
type PressabilityConfig = { disabled?: boolean | null } & {
  [Name in PressabilityCallbackName]?: EventHandler | null;
};

type DispatchState = {
  /** Wrapped, so a thrown `undefined` is rethrown too. */
  firstError: { error: unknown } | null;
};

/**
 * Touches the element as on a device, and calls one Pressability callback (`onPress` for `press`,
 * `onPressIn` for `pressIn`, ...) of the element that becomes the touch responder:
 *
 * 1. Hit testing: the touch targets the element, or its nearest ancestor when `pointerEvents`
 *    blocks it.
 * 2. Responder negotiation, as React Native's `ResponderEventPlugin` does on touch start:
 *    `onStartShouldSetResponder` from the target to the root. The first one returning `true` wins.
 *    A disabled `Pressable` declines, so the touch goes on to its ancestors. Called without
 *    arguments, as in legacy `fireEvent` and `userEvent`.
 * 3. The responder's callback: from its `PressabilityConfig` for `Pressable` and `Touchable*`,
 *    which Pressability exposes in tests as `onStartShouldSetResponder.testOnly_pressabilityConfig()`.
 *    Responders without Pressability, like `PanResponder`, get nothing.
 *
 * The Jest preset mocks `Text` and `TextInput`, so their host elements get `onPress*` props
 * instead of responder props. A host element with any of these props (or their `testOnly_`
 * variants) takes part in the negotiation as if it had Pressability, unless it is a disabled `Text`
 * or a non-editable `TextInput`, as in `userEvent.press()`.
 *
 * One `act()` wraps it all, and a callback error is rethrown after it. During the call,
 * `event.target` is the hit target and `event.currentTarget` the responder.
 *
 * Not implemented yet: the capture phase (`onStartShouldSetResponderCapture`), as `PanResponder`
 * reads `touchHistory` there, which only the responder system's events have.
 *
 * Known limitation: `testOnly_pressabilityConfig` exists only when `NODE_ENV` is `test`, which
 * Jest sets by default. Without it, `Pressable` and `Touchable*` claim the touch but get nothing.
 *
 * @param event from `createPressabilityEvent()`, passed to the callback. React Native passes the
 * responder event derived from `touchStart` to `onPressIn`, and from `touchEnd` to `onPress` and
 * `onPressOut`.
 */
export async function dispatchPressabilityEvent(
  target: TestInstance,
  eventType: PressabilityEventType,
  event: SyntheticEvent,
): Promise<void> {
  if (!isInstanceMounted(target)) {
    return;
  }

  const path = getTouchPath(target);
  if (path.length === 0) {
    return;
  }

  const callbackName = getEventHandlerName(eventType) as PressabilityCallbackName;
  const state: DispatchState = { firstError: null };
  await act(() => {
    getEventInternals(event).target = path[0];
    getEventInternals(event).composedPath = path;
    try {
      const responder = findResponder(path);
      const callback = responder != null ? getCallback(responder, callbackName) : undefined;
      if (responder != null && callback != null) {
        const phase = responder === path[0] ? event.AT_TARGET : event.BUBBLING_PHASE;
        getEventInternals(event).eventPhase = phase;
        getEventInternals(event).currentTarget = responder;
        callback.call(responder, event);
      }
    } catch (error) {
      state.firstError = { error };
    }

    resetEvent(event);
  });

  // After `act()`, which would skip rendering state updates if its callback threw.
  if (state.firstError != null) {
    throw state.firstError.error;
  }
}

/** The hit target, then its host ancestors. Empty when `pointerEvents` blocks every element. */
function getTouchPath(target: TestInstance): TestInstance[] {
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

function findResponder(path: TestInstance[]): TestInstance | null {
  for (const node of path) {
    const handler = getHandlerByName(node.props, 'onStartShouldSetResponder');
    if (handler != null ? handler.call(node) : hasHostCallback(node)) {
      return node;
    }
  }

  return null;
}

function getCallback(
  responder: TestInstance,
  callbackName: PressabilityCallbackName,
): EventHandler | undefined {
  const getConfig: unknown = responder.props.onStartShouldSetResponder?.testOnly_pressabilityConfig;
  if (typeof getConfig !== 'function') {
    return getHostCallback(responder, callbackName);
  }

  const config = getConfig() as PressabilityConfig;
  return config.disabled !== true ? (config[callbackName] ?? undefined) : undefined;
}

function hasHostCallback(instance: TestInstance): boolean {
  return PRESSABILITY_EVENT_TYPES.some(
    (eventType) => getHostCallback(instance, getEventHandlerName(eventType)) != null,
  );
}

/** Callback prop of a mocked `Text` or `TextInput` host, or a `testOnly_` prop. */
function getHostCallback(instance: TestInstance, callbackName: string): EventHandler | undefined {
  if (isHostText(instance) && instance.props.disabled === true) {
    return undefined;
  }

  if (isHostTextInput(instance) && instance.props.editable === false) {
    return undefined;
  }

  return getHandlerByName(instance.props, callbackName);
}
