import { ReactTestInstance } from 'react-test-renderer';
import act from '../act';
import { getHostParent } from '../helpers/component-tree';
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
    element.props.onResponderGrant(defaultPressEvent);
    jest.advanceTimersByTime(options.pressDuration);
    element.props.onResponderRelease(defaultPressEvent);
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
