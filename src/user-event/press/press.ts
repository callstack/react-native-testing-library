import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { getConfig } from '../../config';
import { buildPressEvent } from '../../events/create-event';
import { buildResponderGrantEvent, buildResponderReleaseEvent } from '../../events/legacy';
import { isTestInstance } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { findPressTarget as findLegacyPressTarget } from '../legacy/press';
import { findPressTarget as findModernPressTarget } from '../modern/press';
import type { UserEventConfig, UserEventInstance } from '../setup';
import { Interaction, wait, warnAboutUnhandledInteraction } from '../utils';

// These are constants defined in the React Native repo
// See: https://github.com/facebook/react-native/blob/50e38cc9f1e6713228a91ad50f426c4f65e65e1a/packages/react-native/Libraries/Pressability/Pressability.js#L264
export const DEFAULT_MIN_PRESS_DURATION = 130;
export const DEFAULT_LONG_PRESS_DELAY_MS = 500;

export interface PressOptions {
  duration?: number;
}

export async function press(this: UserEventInstance, instance: TestInstance): Promise<void> {
  if (!isTestInstance(instance)) {
    throw new ErrorWithStack(`press() works only with host instances.`, press);
  }

  const interaction = new Interaction('press', instance);
  await basePress(this.config, interaction, instance, {
    type: 'press',
  });
  warnAboutUnhandledInteraction(interaction);
}

export async function longPress(
  this: UserEventInstance,
  instance: TestInstance,
  options?: PressOptions,
): Promise<void> {
  if (!isTestInstance(instance)) {
    throw new ErrorWithStack(`longPress() works only with host instances.`, longPress);
  }

  const interaction = new Interaction('longPress', instance);
  await basePress(this.config, interaction, instance, {
    type: 'longPress',
    duration: options?.duration ?? DEFAULT_LONG_PRESS_DELAY_MS,
  });
  warnAboutUnhandledInteraction(interaction);
}

interface BasePressOptions {
  type: 'press' | 'longPress';
  duration?: number;
}

const basePress = async (
  config: UserEventConfig,
  interaction: Interaction,
  instance: TestInstance,
  options: BasePressOptions,
): Promise<void> => {
  const findPressTarget =
    getConfig().unstable_eventSystem === 'modern' ? findModernPressTarget : findLegacyPressTarget;
  const targetKind = findPressTarget(interaction, instance);
  if (targetKind === 'host') {
    await emitDirectPressEvents(config, interaction, options);
  } else if (targetKind === 'responder') {
    await emitPressabilityPressEvents(config, interaction, options);
  }
};

/**
 * Dispatches a press event sequence for host instances that have `onPress*` event handlers.
 */
async function emitDirectPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  options: BasePressOptions,
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
    await interaction.dispatchEvent('press', buildPressEvent());
  }
}

async function emitPressabilityPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  options: BasePressOptions,
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
