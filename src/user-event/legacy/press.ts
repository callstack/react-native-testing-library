import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import {
  buildResponderGrantEvent,
  buildResponderReleaseEvent,
  hasPressEventHandler,
  isPointerEventEnabled,
} from '../../events/legacy';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import type { UserEventConfig } from '../setup';
import type { Interaction } from '../utils';
import { wait } from '../utils';

// These are constants defined in the React Native repo
// See: https://github.com/facebook/react-native/blob/50e38cc9f1e6713228a91ad50f426c4f65e65e1a/packages/react-native/Libraries/Pressability/Pressability.js#L264
const DEFAULT_MIN_PRESS_DURATION = 130;
const DEFAULT_LONG_PRESS_DELAY_MS = 500;

export type EmitPressOptions = {
  type: 'press' | 'longPress';
  /**
   * How long the touch lasts. Defaults to Pressability's long press delay (500 ms) for
   * `longPress()`, and for `press()` to its minimum press duration (130 ms) on a touch responder,
   * or the `delay` option of `userEvent.setup()` on a mocked element.
   */
  duration?: number;
};

/**
 * Presses the element from `findPressTarget()`: calls a mocked element's `onPress*` props directly,
 * or a touch responder's `onResponderGrant` and `onResponderRelease`, so Pressability's timers
 * decide which callbacks to call.
 */
export async function emitPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  instance: TestInstance,
  options: EmitPressOptions,
) {
  // Hold a long press for Pressability's long press delay, so its timer calls `onLongPress`.
  const resolvedOptions =
    options.type === 'longPress'
      ? { ...options, duration: options.duration ?? DEFAULT_LONG_PRESS_DELAY_MS }
      : options;

  const targetKind = findPressTarget(interaction, instance);
  if (targetKind === 'mocked-direct') {
    await emitMockedDirectPressEvents(config, interaction, resolvedOptions);
  } else if (targetKind === 'touch-responder') {
    await emitTouchResponderPressEvents(config, interaction, resolvedOptions);
  }
}

/**
 * What kind of element receives the press:
 * - `'mocked-direct'`: a host element with `onPress*` props (or their `testOnly_` variants), called
 *   directly. Real host elements never get these props, as Pressability turns them into responder
 *   props, but mocks do: the Jest preset's `mockComponent()` passes all props of `Text` and
 *   `TextInput` on to a host element.
 * - `'touch-responder'`: an element whose `onStartShouldSetResponder` accepts the touch, like the
 *   host element of `Pressable` or `TouchableOpacity`.
 */
type PressTargetKind = 'mocked-direct' | 'touch-responder';

/**
 * Finds the element that receives the press, from the instance up to the root, and sets it as
 * `interaction.target`: the nearest enabled mocked element (`'mocked-direct'`), or touch
 * responder (`'touch-responder'`). Elements that could handle the press, but are disabled or block
 * touches, are added to `interaction.skippedTargets`.
 *
 * A non-editable `TextInput` is skipped, and a `TextInput` without `onPress*` props passes the
 * press on to its ancestors. Modern `findPressTarget()` keeps it, as React Native does.
 *
 * @returns what kind of element the target is, or `null` when no element receives the press.
 */
function findPressTarget(interaction: Interaction, instance: TestInstance): PressTargetKind | null {
  let current: TestInstance | null = instance;
  while (current != null) {
    if (isEnabledHostElement(current) && hasPressEventHandler(current.props)) {
      interaction.target = current;
      return 'mocked-direct';
    }

    if (isEnabledTouchResponder(current)) {
      interaction.target = current;
      return 'touch-responder';
    }

    // The element could handle the press, but is disabled or blocks touches.
    if (hasPressEventHandler(current.props) || current.props.onStartShouldSetResponder) {
      interaction.skippedTargets.push(current);
    }

    current = current.parent;
  }

  return null;
}

function isEnabledHostElement(instance: TestInstance) {
  if (!isPointerEventEnabled(instance)) {
    return false;
  }

  if (isHostText(instance)) {
    return instance.props.disabled !== true;
  }

  if (isHostTextInput(instance)) {
    return instance.props.editable !== false;
  }

  return true;
}

function isEnabledTouchResponder(instance: TestInstance) {
  return isPointerEventEnabled(instance) && instance.props.onStartShouldSetResponder?.();
}

/**
 * Calls the target's `onPress*` props in the order Pressability calls them. Like Pressability,
 * calls them only on the target, so `onPress*` props of its ancestors are not called.
 */
async function emitMockedDirectPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  options: EmitPressOptions,
) {
  await wait(config);
  await interaction.dispatchTouchEvent('pressIn');

  await wait(config, options.duration);

  // Long press events are emitted before `pressOut`.
  if (options.type === 'longPress') {
    await interaction.dispatchTouchEvent('longPress');
  }

  await interaction.dispatchTouchEvent('pressOut');

  // Regular press events are emitted after `pressOut` according to the React Native docs.
  // See: https://reactnative.dev/docs/pressable#onpress
  // Experimentally for very short presses (< 130ms) `press` events are actually emitted before `onPressOut`, but
  // we will ignore that as in reality most pressed would be above the 130ms threshold.
  if (options.type === 'press') {
    await interaction.dispatchTouchEvent('press');
  }
}

async function emitTouchResponderPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  options: EmitPressOptions,
) {
  await wait(config);

  await interaction.invokeEventHandler('responderGrant', buildResponderGrantEvent());

  const duration = options.duration ?? DEFAULT_MIN_PRESS_DURATION;
  await wait(config, duration);

  await interaction.invokeEventHandler('responderRelease', buildResponderReleaseEvent());

  // React Native will wait for minimal delay of DEFAULT_MIN_PRESS_DURATION
  // before emitting the `pressOut` event. We need to wait here, so that
  // `press()` function does not return before that.
  if (DEFAULT_MIN_PRESS_DURATION - duration > 0) {
    await act(() => wait(config, DEFAULT_MIN_PRESS_DURATION - duration));
  }
}
