import { ReactTestInstance } from 'react-test-renderer';
import act from '../act';

const defaultPressEvent = {
  persist: jest.fn(),
  nativeEvent: {
    timestamp: new Date().getTime(),
  },
  currentTarget: { measure: jest.fn() },
};

export const press = (element: ReactTestInstance) => {
  act(() => {
    if (element.props.onStartShouldSetResponder()) {
      element.props.onResponderGrant(defaultPressEvent);
      element.props.onResponderRelease(defaultPressEvent);
      jest.runOnlyPendingTimers();
    }
  });
};
