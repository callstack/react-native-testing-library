import { ReactTestInstance } from 'react-test-renderer';
import act from '../../act';
import { getHostParent } from '../../helpers/component-tree';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import {
  isHostText,
  isHostTextInput,
} from '../../helpers/host-component-names';
import { EventBuilder } from '../event-builder';
import { UserEventConfig, UserEventInstance } from '../setup';
import { dispatchEvent, wait, warnAboutRealTimersIfNeeded } from '../utils';
import { DEFAULT_MIN_PRESS_DURATION } from './constants';

export type PressOptions = {
  duration: number;
};

export async function press(
  this: UserEventInstance,
  element: ReactTestInstance
): Promise<void> {
  await basePress(this.config, element, 'press');
}

export async function longPress(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: PressOptions = { duration: 500 }
): Promise<void> {
  await basePress(this.config, element, 'longPress', options);
}

type PressType = 'press' | 'longPress';

const basePress = async (
  config: UserEventConfig,
  element: ReactTestInstance,
  type: PressType,
  options: PressOptions = { duration: 0 }
): Promise<void> => {
  if (isPressableText(element)) {
    await emitTextPressEvents(config, element, type, options);
    return;
  }

  if (isEnabledTextInput(element)) {
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

  await basePress(config, hostParentElement, type, options);
};

const emitPressablePressEvents = async (
  config: UserEventConfig,
  element: ReactTestInstance,
  options: PressOptions
) => {
  warnAboutRealTimersIfNeeded();

  await wait(config);

  await act(async () => {
    dispatchEvent(
      element,
      'responderGrant',
      EventBuilder.Common.responderGrant()
    );

    await wait(config, options.duration);

    dispatchEvent(
      element,
      'responderRelease',
      EventBuilder.Common.responderRelease()
    );

    // React Native will wait for minimal delay of DEFAULT_MIN_PRESS_DURATION
    // before emitting the `pressOut` event. We need to wait here, so that
    // `press()` function does not return before that.
    if (DEFAULT_MIN_PRESS_DURATION - options.duration > 0) {
      await wait(config, DEFAULT_MIN_PRESS_DURATION - options.duration);
    }
  });
};

const isEnabledTouchResponder = (element: ReactTestInstance) => {
  return (
    isPointerEventEnabled(element) &&
    element.props.onStartShouldSetResponder?.()
  );
};

const isPressableText = (element: ReactTestInstance) => {
  const hasPressEventHandler = Boolean(
    element.props.onPress ||
      element.props.onLongPress ||
      element.props.onPressIn ||
      element.props.onPressOut
  );

  return (
    isHostText(element) &&
    isPointerEventEnabled(element) &&
    !element.props.disabled &&
    hasPressEventHandler
  );
};

const isEnabledTextInput = (element: ReactTestInstance) => {
  return (
    isHostTextInput(element) &&
    isPointerEventEnabled(element) &&
    element.props.editable !== false
  );
};

/**
 * Dispatches a press event sequence for Text.
 */
async function emitTextPressEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  type: PressType,
  options: PressOptions
) {
  await wait(config);
  dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());

  dispatchEvent(element, type, EventBuilder.Common.touch());

  await wait(config, options.duration);
  dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());
}

/**
 * Dispatches a press event sequence for TextInput.
 */
async function emitTextInputPressEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  options: PressOptions
) {
  await wait(config);
  dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());

  // Note: TextInput does not have `onPress`/`onLongPress` props.

  await wait(config, options.duration);
  dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());
}
