import { ReactTestInstance } from 'react-test-renderer';
import { getHostParent } from '../../helpers/component-tree';
import { isTextInputEditable } from '../../helpers/text-input';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { isHostText, isHostTextInput } from '../../helpers/host-component-names';
import { EventBuilder } from '../event-builder';
import { UserEventConfig, UserEventInstance } from '../setup';
import { dispatchEvent, wait } from '../utils';

// These are constants defined in the React Native repo
export const DEFAULT_MIN_PRESS_DURATION = 130;
export const DEFAULT_LONG_PRESS_DELAY_MS = 500;

export interface PressOptions {
  duration?: number;
}

export async function press(this: UserEventInstance, element: ReactTestInstance): Promise<void> {
  await basePress(this.config, element, {
    type: 'press',
    duration: 0,
  });
}

export async function longPress(
  this: UserEventInstance,
  element: ReactTestInstance,
  options?: PressOptions,
): Promise<void> {
  await basePress(this.config, element, {
    type: 'longPress',
    duration: options?.duration ?? DEFAULT_LONG_PRESS_DELAY_MS,
  });
}

interface BasePressOptions {
  type: 'press' | 'longPress';
  duration: number;
}

const basePress = async (
  config: UserEventConfig,
  element: ReactTestInstance,
  options: BasePressOptions,
): Promise<void> => {
  if (isPressableText(element)) {
    await emitTextPressEvents(config, element, options);
    return;
  }

  if (isHostTextInput(element) && isTextInputEditable(element) && isPointerEventEnabled(element)) {
    await emitTextInputPressEvents(config, element, options);
    return;
  }

  if (isEnabledTouchResponder(element)) {
    await emitPressablePressEvents(config, element, options);
    return;
  }

  const hostParentElement = getHostParent(element);
  if (!hostParentElement) {
    return;
  }

  await basePress(config, hostParentElement, options);
};

const emitPressablePressEvents = async (
  config: UserEventConfig,
  element: ReactTestInstance,
  options: BasePressOptions,
) => {
  await wait(config);

  dispatchEvent(element, 'responderGrant', EventBuilder.Common.responderGrant());

  // We apply minimum press duration here to ensure that `press` events are emitted after `pressOut`.
  // Otherwise, pressables would emit them in the reverse order, which in reality happens only for
  // very short presses (< 130ms) and contradicts the React Native docs.
  // See: https://reactnative.dev/docs/pressable#onpress
  let duration = Math.max(options.duration, DEFAULT_MIN_PRESS_DURATION);
  await wait(config, duration);

  dispatchEvent(element, 'responderRelease', EventBuilder.Common.responderRelease());
};

const isEnabledTouchResponder = (element: ReactTestInstance) => {
  return isPointerEventEnabled(element) && element.props.onStartShouldSetResponder?.();
};

const isPressableText = (element: ReactTestInstance) => {
  const hasPressEventHandler = Boolean(
    element.props.onPress ||
      element.props.onLongPress ||
      element.props.onPressIn ||
      element.props.onPressOut,
  );

  return (
    isHostText(element) &&
    isPointerEventEnabled(element) &&
    !element.props.disabled &&
    hasPressEventHandler
  );
};

/**
 * Dispatches a press event sequence for Text.
 */
async function emitTextPressEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  options: BasePressOptions,
) {
  await wait(config);
  dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());

  await wait(config, options.duration);

  // Long press events are emitted before `pressOut`.
  if (options.type === 'longPress') {
    dispatchEvent(element, 'longPress', EventBuilder.Common.touch());
  }

  dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());

  // Regular press events are emitted after `pressOut` according to the React Native docs.
  // See: https://reactnative.dev/docs/pressable#onpress
  // Experimentally for very short presses (< 130ms) `press` events are actually emitted before `onPressOut`, but
  // we will ignore that as in reality most pressed would be above the 130ms threshold.
  if (options.type === 'press') {
    dispatchEvent(element, 'press', EventBuilder.Common.touch());
  }
}

/**
 * Dispatches a press event sequence for TextInput.
 */
async function emitTextInputPressEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  options: BasePressOptions,
) {
  await wait(config);
  dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());

  // Note: TextInput does not have `onPress`/`onLongPress` props.

  await wait(config, options.duration);
  dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());
}
