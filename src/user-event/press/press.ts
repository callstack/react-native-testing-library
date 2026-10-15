import type { TestInstance } from 'test-renderer';

import { getConfig } from '../../config';
import { isTestInstance } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { emitPressEvents as emitLegacyPressEvents } from '../legacy/press';
import type { EmitPressOptions } from '../modern/press';
import { emitPressEvents as emitModernPressEvents } from '../modern/press';
import type { UserEventConfig, UserEventInstance } from '../setup';
import { Interaction, warnAboutUnhandledInteraction } from '../utils';

export interface PressOptions {
  duration?: number;
}

export async function press(this: UserEventInstance, instance: TestInstance): Promise<void> {
  if (!isTestInstance(instance)) {
    throw new ErrorWithStack(`press() works only with host instances.`, press);
  }

  const interaction = new Interaction('press', instance);
  await emitPressEvents(this.config, interaction, instance, { type: 'press' });
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
  await emitPressEvents(this.config, interaction, instance, {
    type: 'longPress',
    duration: options?.duration,
  });
  warnAboutUnhandledInteraction(interaction);
}

async function emitPressEvents(
  config: UserEventConfig,
  interaction: Interaction,
  instance: TestInstance,
  options: EmitPressOptions,
): Promise<void> {
  if (getConfig().unstable_eventSystem === 'modern') {
    await emitModernPressEvents(config, interaction, instance, options);
  } else {
    await emitLegacyPressEvents(config, interaction, instance, options);
  }
}
