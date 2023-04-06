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

export const press = (element: ReactTestInstance) => {
  if (isEnabledTouchResponder(element)) {
    triggerPressEvent(element);
    return;
  }

  const hostParentElement = getHostParent(element);
  if (!hostParentElement) {
    return;
  }

  press(hostParentElement);
};

const triggerPressEvent = (element: ReactTestInstance) => {
  act(() => {
    element.props.onResponderGrant(defaultPressEvent);
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
