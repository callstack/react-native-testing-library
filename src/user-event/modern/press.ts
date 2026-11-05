import type { TestInstance } from 'test-renderer';

import type { SyntheticEvent } from '../../events/modern/event';
import type { PressabilityEventType } from '../../events/modern/event-types';
import {
  dispatchPressabilityEvent,
  findPressResponder,
  getDisplayNoneBlocker,
  getPressabilityCallback,
  getTouchPath,
} from '../../events/modern/pressability';
import { createPressabilityEvent } from '../../events/modern/responder-event';
import type { UserEventConfig } from '../setup';
import type { Interaction } from '../utils';
import { wait } from '../utils';

export type EmitPressOptions = {
  type: 'press' | 'longPress';
  /** How long the touch lasts. Defaults to the `delay` option of `userEvent.setup()`. */
  duration?: number;
};

/**
 * Presses the element as a touch on a device does: finds the touch responder as modern
 * `fireEvent.press()` does, then calls its Pressability callbacks in the order Pressability calls
 * them, each with a `SyntheticEvent`:
 *
 * 1. `onPressIn` on touch start.
 * 2. `onLongPress`, for `longPress()`.
 * 3. `onPressOut` on touch end.
 * 4. `onPress`, unless `onLongPress` was called.
 *
 * As in React Native, `onPressIn` and `onLongPress` get the same event (`responderGrant`, created
 * when the touch starts), and `onPressOut` and `onPress` another one (`responderRelease`, created
 * when it ends).
 *
 * Calls the callbacks directly instead of the responder's `onResponderGrant` and
 * `onResponderRelease`, so Pressability's timers aren't run. The action, not the touch duration,
 * decides whether it is a long press: `longPress()` calls `onLongPress` whatever the responder's
 * `delayLongPress`, and `press()` never does. The touch lasts `duration`, only so timers in the
 * component can run. `onPressOut` comes right on touch end, even for touches shorter than
 * `minPressDuration` (130 ms), and `delayPressIn` and `delayPressOut` are ignored. Responders
 * without Pressability, like `PanResponder`, get nothing.
 */
export async function emitPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  instance: TestInstance,
  options: EmitPressOptions,
) {
  const path = getTouchPath(instance);
  const responder = findPressTarget(interaction, instance, path);
  if (responder == null) {
    return;
  }

  /** Calls the callbacks in one `act()`, as React Native calls them from one responder event. */
  const dispatch = async (eventTypes: PressabilityEventType[], event: SyntheticEvent) => {
    const { calledEventTypes, isHandled } = await dispatchPressabilityEvent(
      responder,
      eventTypes,
      event,
      path[0],
    );
    for (const eventType of eventTypes) {
      interaction.recordEvent(eventType, calledEventTypes.includes(eventType));
    }

    // A responder without Pressability, like `PanResponder`, handles the touch its own way.
    if (isHandled) {
      interaction.hasCalledHandler = true;
    }
  };

  await wait(config);
  const pressStartEvent = createPressabilityEvent('pressIn');
  await dispatch(['pressIn'], pressStartEvent);

  await wait(config, options.duration);
  const isLongPress = options.type === 'longPress';
  if (isLongPress) {
    await dispatch(['longPress'], pressStartEvent);
  }

  // Pressability skips `onPress` after a long press only when there is an `onLongPress`.
  const isPressCanceledByLongPress =
    isLongPress && getPressabilityCallback(responder, 'longPress') != null;
  const pressEndEvent = createPressabilityEvent('pressOut');
  await dispatch(isPressCanceledByLongPress ? ['pressOut'] : ['pressOut', 'press'], pressEndEvent);
}

/**
 * Sets `interaction.target` to the touch responder, the element modern `fireEvent.press()` calls.
 * Elements between the pressed element and the responder that could handle the press, but are
 * disabled or block touches, are added to `interaction.skippedTargets`. When `display: none` hides
 * the element, sets `interaction.displayNoneBlocker`.
 *
 * @returns the responder, or `null` when no element receives the press.
 */
function findPressTarget(
  interaction: Interaction,
  instance: TestInstance,
  path: TestInstance[],
): TestInstance | null {
  if (path.length === 0) {
    interaction.displayNoneBlocker = getDisplayNoneBlocker(instance);
  }

  const { responder, skippedTargets } = findPressResponder(instance, path);
  interaction.skippedTargets.push(...skippedTargets);
  if (responder != null) {
    interaction.target = responder;
  }

  return responder;
}
