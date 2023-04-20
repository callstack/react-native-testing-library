import { ReactTestInstance } from 'react-test-renderer';
import act from '../act';
import { getHostParent } from '../helpers/component-tree';
import { filterNodeByType } from '../helpers/filterNodeByType';
import { isHostElementPointerEventEnabled } from '../helpers/isHostElementPointerEventEnabled';

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
  // Text component is mocked in React Native preset so the mock
  // doesn't implement the pressability class
  // Thus we need to call the onPress prop directly on the host component
  if (filterNodeByType(element, 'Text') && !element.props.disabled) {
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
