import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import {
  buildResponderGrantEvent,
  buildResponderReleaseEvent,
  buildTouchEvent,
} from '../../event-builder';
import { getEventHandlerFromProps } from '../../event-handler';
import { isTestInstance } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import type { UserEventConfig, UserEventInstance } from '../setup';
import { dispatchEvent, wait } from '../utils';

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

  await basePress(this.config, instance, {
    type: 'press',
  });
}

export async function longPress(
  this: UserEventInstance,
  instance: TestInstance,
  options?: PressOptions,
): Promise<void> {
  if (!isTestInstance(instance)) {
    throw new ErrorWithStack(`longPress() works only with host instances.`, longPress);
  }

  await basePress(this.config, instance, {
    type: 'longPress',
    duration: options?.duration ?? DEFAULT_LONG_PRESS_DELAY_MS,
  });
}

interface BasePressOptions {
  type: 'press' | 'longPress';
  duration?: number;
}

const basePress = async (
  config: UserEventConfig,
  instance: TestInstance,
  options: BasePressOptions,
): Promise<void> => {
  if (isEnabledHostElement(instance) && hasPressEventHandler(instance)) {
    await emitDirectPressEvents(config, instance, options);
    return;
  }

  if (isEnabledTouchResponder(instance)) {
    await emitPressabilityPressEvents(config, instance, options);
    return;
  }

  if (!instance.parent) {
    return;
  }

  await basePress(config, instance.parent, options);
};

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

function hasPressEventHandler(instance: TestInstance) {
  return (
    getEventHandlerFromProps(instance.props, 'press') ||
    getEventHandlerFromProps(instance.props, 'longPress') ||
    getEventHandlerFromProps(instance.props, 'pressIn') ||
    getEventHandlerFromProps(instance.props, 'pressOut')
  );
}

/**
 * Dispatches a press event sequence for host instances that have `onPress*` event handlers.
 */
async function emitDirectPressEvents(
  config: UserEventConfig,
  instance: TestInstance,
  options: BasePressOptions,
) {
  await wait(config);
  await dispatchEvent(instance, 'pressIn', buildTouchEvent());

  await wait(config, options.duration);

  // Long press events are emitted before `pressOut`.
  if (options.type === 'longPress') {
    await dispatchEvent(instance, 'longPress', buildTouchEvent());
  }

  await dispatchEvent(instance, 'pressOut', buildTouchEvent());

  // Regular press events are emitted after `pressOut` according to the React Native docs.
  // See: https://reactnative.dev/docs/pressable#onpress
  // Experimentally for very short presses (< 130ms) `press` events are actually emitted before `onPressOut`, but
  // we will ignore that as in reality most pressed would be above the 130ms threshold.
  if (options.type === 'press') {
    await dispatchEvent(instance, 'press', buildTouchEvent());
  }
}

async function emitPressabilityPressEvents(
  config: UserEventConfig,
  instance: TestInstance,
  options: BasePressOptions,
) {
  await wait(config);

  await dispatchEvent(instance, 'responderGrant', buildResponderGrantEvent());

  const duration = options.duration ?? DEFAULT_MIN_PRESS_DURATION;
  await wait(config, duration);

  await dispatchEvent(instance, 'responderRelease', buildResponderReleaseEvent());

  // React Native will wait for minimal delay of DEFAULT_MIN_PRESS_DURATION
  // before emitting the `pressOut` event. We need to wait here, so that
  // `press()` function does not return before that.
  if (DEFAULT_MIN_PRESS_DURATION - duration > 0) {
    await act(() => wait(config, DEFAULT_MIN_PRESS_DURATION - duration));
  }
}
