import { ReactTestInstance } from 'react-test-renderer';
import act from '../act';
import { getHostParent } from '../helpers/component-tree';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { isHostElementPointerEventEnabled } from '../helpers/isHostElementPointerEventEnabled';
import { getHostComponentNames } from '../helpers/host-component-names';
import { jestFakeTimersAreEnabled } from '../helpers/timers';
import { DEFAULT_MIN_PRESS_DURATION } from './constants';

const defaultPressEvent = {
  persist: jest.fn(),
  nativeEvent: {
    timestamp: new Date().getTime(),
  },
  currentTarget: { measure: jest.fn() },
};

export type PressOptions = {
  pressDuration: number;
};

export const basePress = async (
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 0 }
): Promise<void> => {
  // Text and TextInput components are mocked in React Native preset so the mock
  // doesn't implement the pressability class
  // Thus we need to call the props directly on the host component
  const isEnabledHostText =
    filterNodeByType(element, getHostComponentNames().text) &&
    !element.props.disabled;
  const isEnabledTextInput =
    filterNodeByType(element, getHostComponentNames().textInput) &&
    element.props.editable !== false;

  if (isEnabledHostText || isEnabledTextInput) {
    const { onPressIn, onPress, onPressOut } = element.props;
    if (onPressIn) {
      onPressIn(defaultPressEvent);
    }
    if (onPress) {
      onPress(defaultPressEvent);
    }
    if (onPressOut) {
      onPressOut(defaultPressEvent);
    }
  }

  if (isEnabledTouchResponder(element)) {
    await triggerPressEvent(element, options);
    return;
  }

  const hostParentElement = getHostParent(element);
  if (!hostParentElement) {
    return;
  }

  await basePress(hostParentElement, options);
};

export const press = async (element: ReactTestInstance): Promise<void> =>
  basePress(element);

export const longPress = async (
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 500 }
): Promise<void> => basePress(element, options);

const triggerPressEvent = async (
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 0 }
) => {
  const areFakeTimersEnabled = jestFakeTimersAreEnabled();

  await act(async () => {
    element.props.onResponderGrant({
      ...defaultPressEvent,
      dispatchConfig: { registrationName: 'onResponderGrant' },
    });

    if (areFakeTimersEnabled) {
      jest.advanceTimersByTime(options.pressDuration);
    } else {
      await wait(options.pressDuration);
    }

    element.props.onResponderRelease({
      ...defaultPressEvent,
      dispatchConfig: { registrationName: 'onResponderRelease' },
    });

    if (areFakeTimersEnabled) {
      jest.runOnlyPendingTimers();
    } else {
      await wait(DEFAULT_MIN_PRESS_DURATION);
    }
  });
};

const isEnabledTouchResponder = (element: ReactTestInstance) => {
  return (
    isHostElementPointerEventEnabled(element) &&
    element.props.onStartShouldSetResponder &&
    element.props.onStartShouldSetResponder()
  );
};

const wait = async (durationInMs: number) => {
  await new Promise((resolve) => setTimeout(resolve, durationInMs));
};
