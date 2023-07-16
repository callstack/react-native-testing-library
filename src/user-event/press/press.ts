import { ReactTestInstance } from 'react-test-renderer';
import { EventBuilder } from '../event-builder';
import { UserEventInstance } from '../setup';
import { wait } from '../utils';
import act from '../../act';
import { getHostParent } from '../../helpers/component-tree';
import { filterNodeByType } from '../../helpers/filterNodeByType';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { getHostComponentNames } from '../../helpers/host-component-names';
import { jestFakeTimersAreEnabled } from '../../helpers/timers';
import { DEFAULT_MIN_PRESS_DURATION } from './constants';
import { warnAboutRealTimers } from './utils/warnAboutRealTimers';

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
  config: UserEventInstance['config'],
  element: ReactTestInstance,
  options: PressOptions = { duration: 0 }
): Promise<void> => {
  // Text and TextInput components are mocked in React Native preset so the mock
  // doesn't implement the pressability class
  // Thus we need to call the props directly on the host component
  if (isEnabledHostText(element) || isEnabledTextInput(element)) {
    await triggerMockPressEvent(config, element, options);
    return;
  }

  if (isEnabledTouchResponder(element)) {
    await triggerPressEvent(config, element, options);
    return;
  }

  const hostParentElement = getHostParent(element);
  if (!hostParentElement) {
    return;
  }

  await basePress(config, hostParentElement, options);
};

const triggerPressEvent = async (
  config: UserEventInstance['config'],
  element: ReactTestInstance,
  options: PressOptions = { duration: 0 }
) => {
  const areFakeTimersEnabled = jestFakeTimersAreEnabled();
  if (!areFakeTimersEnabled) {
    warnAboutRealTimers();
  }

  await wait(config);

  await act(async () => {
    element.props.onResponderGrant({
      ...EventBuilder.Common.touch(),
      dispatchConfig: { registrationName: 'onResponderGrant' },
    });

    await wait(config, options.duration);

    element.props.onResponderRelease({
      ...EventBuilder.Common.touch(),
      dispatchConfig: { registrationName: 'onResponderRelease' },
    });

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

const isEnabledHostText = (element: ReactTestInstance) => {
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

const triggerMockPressEvent = async (
  config: UserEventInstance['config'],
  element: ReactTestInstance,
  options: PressOptions = { duration: 0 }
) => {
  const { onPressIn, onPress, onPressOut } = element.props;
  await wait(config);
  if (onPressIn) {
    onPressIn(EventBuilder.Common.touch());
  }
  if (onPress) {
    onPress(EventBuilder.Common.touch());
  }
  await wait(config, options.duration);
  if (onPressOut) {
    if (DEFAULT_MIN_PRESS_DURATION - options.duration > 0) {
      await wait(config, DEFAULT_MIN_PRESS_DURATION - options.duration);
    }
    onPressOut(EventBuilder.Common.touch());
  }
};
