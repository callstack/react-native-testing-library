import { ReactTestInstance } from 'react-test-renderer';
import act from '../../act';
import { getHostParent } from '../../helpers/component-tree';
import { filterNodeByType } from '../../helpers/filterNodeByType';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { getHostComponentNames } from '../../helpers/host-component-names';
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
  await basePress(this.config, element);
}

export async function longPress(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: PressOptions = { duration: 500 }
): Promise<void> {
  await basePress(this.config, element, options);
}

const basePress = async (
  config: UserEventConfig,
  element: ReactTestInstance,
  options: PressOptions = { duration: 0 }
): Promise<void> => {
  // Text and TextInput components are mocked in React Native preset so the mock
  // doesn't implement the pressability class
  // Thus we need to call the props directly on the host component
  if (isPressableText(element) || isEnabledTextInput(element)) {
    await emitBasicPressEvents(config, element, options);
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
  options: PressOptions = { duration: 0 }
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
  return (
    filterNodeByType(element, getHostComponentNames().text) &&
    isPointerEventEnabled(element) &&
    !element.props.disabled &&
    element.props.onPress
  );
};

const isEnabledTextInput = (element: ReactTestInstance) => {
  return (
    filterNodeByType(element, getHostComponentNames().textInput) &&
    isPointerEventEnabled(element) &&
    element.props.editable !== false
  );
};

/**
 * Dispatches a basic press event sequence on non-Pressable component,
 * e.g. Text or TextInput.
 */
async function emitBasicPressEvents(
  config: UserEventConfig,
  element: ReactTestInstance,
  options: PressOptions = { duration: 0 }
) {
  await wait(config);
  dispatchEvent(element, 'pressIn', EventBuilder.Common.touch());

  dispatchEvent(element, 'press', EventBuilder.Common.touch());

  await wait(config, options.duration);
  dispatchEvent(element, 'pressOut', EventBuilder.Common.touch());
}
