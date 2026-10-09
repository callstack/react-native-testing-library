import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import { getHandlerByName } from '../shared/handler';
import { getPointerEventsBlocker } from '../shared/pointer-events';
import type { EventHandler } from '../shared/types';
import { resetEvent } from './dispatch';
import type { EventPhase } from './event';
import { getEventInternals, SyntheticEvent } from './event';

/** The part of React Native's `PressabilityConfig` that `dispatchPress()` reads. */
type PressabilityConfig = {
  disabled?: boolean | null;
  onPress?: EventHandler | null;
};

type PressState = {
  hasCalledHandler: boolean;
  /** Wrapped, so a thrown `undefined` is rethrown too. */
  firstError: { error: unknown } | null;
};

/**
 * Presses the element as a tap on a device does, and calls `onPress` of the element that becomes
 * the touch responder:
 *
 * 1. Hit testing: the touch targets the element, or its nearest ancestor when `pointerEvents`
 *    blocks it.
 * 2. Responder negotiation, as React Native's `ResponderEventPlugin` does on touch start:
 *    `onStartShouldSetResponderCapture` from the root to the target, then
 *    `onStartShouldSetResponder` from the target to the root. The first one returning `true` wins.
 *    A disabled `Pressable` declines, so the touch goes on to its ancestors.
 * 3. The responder's `onPress`: from its `PressabilityConfig` for `Pressable` and `Touchable*`,
 *    which Pressability exposes in tests as `onStartShouldSetResponder.testOnly_pressabilityConfig()`.
 *    Responders without Pressability, like `PanResponder`, don't get `onPress`.
 *
 * The Jest preset mocks `Text` and `TextInput`, so their host elements get `onPress` instead of
 * responder props. A host element with its own `onPress` (or `testOnly_onPress`) takes part in
 * the negotiation as if it had Pressability, unless it is a disabled `Text` or a non-editable
 * `TextInput`, as in `userEvent.press()`.
 *
 * Only `onPress` is called, not `onPressIn`, `onPressOut` or `onLongPress`. One `act()` wraps it
 * all, and a handler error is rethrown after it.
 *
 * Known limitation: `testOnly_pressabilityConfig` exists only when `NODE_ENV` is `test`, which
 * Jest sets by default. Without it, `Pressable` and `Touchable*` claim the touch but get no
 * `onPress`.
 *
 * @returns `true` if `onPress` was called.
 */
export async function dispatchPress(target: TestInstance, event: SyntheticEvent): Promise<boolean> {
  if (!isInstanceMounted(target)) {
    return false;
  }

  const path = getTouchPath(target);
  if (path.length === 0) {
    return false;
  }

  const state: PressState = { hasCalledHandler: false, firstError: null };
  await act(() => {
    getEventInternals(event).target = path[0];
    getEventInternals(event).composedPath = path;
    try {
      const responder = findResponder(event, path);
      if (responder != null) {
        callOnPress(event, responder, path, state);
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

  return state.hasCalledHandler;
}

/**
 * The hit target first, then its host ancestors. The hit target is the element, or its nearest
 * ancestor when `pointerEvents` blocks it. Empty when `pointerEvents` blocks every element.
 */
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

function findResponder(event: SyntheticEvent, path: TestInstance[]): TestInstance | null {
  for (let i = path.length - 1; i >= 0; i -= 1) {
    const phase = i === 0 ? SyntheticEvent.AT_TARGET : SyntheticEvent.CAPTURING_PHASE;
    const handler = getHandlerByName(path[i].props, 'onStartShouldSetResponderCapture');
    if (handler != null && callWithEvent(event, path[i], phase, handler)) {
      return path[i];
    }
  }

  for (let i = 0; i < path.length; i += 1) {
    const phase = i === 0 ? SyntheticEvent.AT_TARGET : SyntheticEvent.BUBBLING_PHASE;
    const handler = getHandlerByName(path[i].props, 'onStartShouldSetResponder');
    if (handler != null) {
      if (callWithEvent(event, path[i], phase, handler)) {
        return path[i];
      }
    } else if (getHostOnPress(path[i]) != null) {
      return path[i];
    }
  }

  return null;
}

function callOnPress(
  event: SyntheticEvent,
  responder: TestInstance,
  path: TestInstance[],
  state: PressState,
) {
  const onPress = getPressabilityOnPress(responder) ?? getHostOnPress(responder);
  if (onPress == null) {
    return;
  }

  const phase = responder === path[0] ? SyntheticEvent.AT_TARGET : SyntheticEvent.BUBBLING_PHASE;
  state.hasCalledHandler = true;
  callWithEvent(event, responder, phase, onPress);
}

function getPressabilityOnPress(instance: TestInstance): EventHandler | undefined {
  const getConfig: unknown = instance.props.onStartShouldSetResponder?.testOnly_pressabilityConfig;
  if (typeof getConfig !== 'function') {
    return undefined;
  }

  const config = getConfig() as PressabilityConfig;
  return config.disabled !== true ? (config.onPress ?? undefined) : undefined;
}

/** `onPress` of a mocked `Text` or `TextInput` host, or a `testOnly_onPress` prop. */
function getHostOnPress(instance: TestInstance): EventHandler | undefined {
  if (isHostText(instance) && instance.props.disabled === true) {
    return undefined;
  }

  if (isHostTextInput(instance) && instance.props.editable === false) {
    return undefined;
  }

  return getHandlerByName(instance.props, 'onPress');
}

function callWithEvent(
  event: SyntheticEvent,
  node: TestInstance,
  phase: EventPhase,
  handler: EventHandler,
): unknown {
  getEventInternals(event).eventPhase = phase;
  getEventInternals(event).currentTarget = node;
  return handler.call(node, event);
}
