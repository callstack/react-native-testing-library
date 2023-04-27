import { ReactTestInstance } from 'react-test-renderer';
import act from '../act';
import { getHostParent } from '../helpers/component-tree';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { isHostElementPointerEventEnabled } from '../helpers/isHostElementPointerEventEnabled';
import { getHostComponentNames } from '../helpers/host-component-names';

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

export const press = (
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 0 }
) => {
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
    triggerPressEvent(element, options);
    return;
  }

  const hostParentElement = getHostParent(element);
  if (!hostParentElement) {
    return;
  }

  press(hostParentElement, options);
};

const triggerPressEvent = (
  element: ReactTestInstance,
  options: PressOptions = { pressDuration: 0 }
) => {
  act(() => {
    element.props.onResponderGrant({
      ...defaultPressEvent,
      dispatchConfig: { registrationName: 'onResponderGrant' },
    });
    jest.advanceTimersByTime(options.pressDuration);
    element.props.onResponderRelease({
      ...defaultPressEvent,
      dispatchConfig: { registrationName: 'onResponderRelease' },
    });
    jest.runOnlyPendingTimers();
  });
};

const isEnabledTouchResponder = (element: ReactTestInstance) => {
  return (
    isHostElementPointerEventEnabled(element) &&
    element.props.onStartShouldSetResponder &&
    element.props.onStartShouldSetResponder()
  );
};
