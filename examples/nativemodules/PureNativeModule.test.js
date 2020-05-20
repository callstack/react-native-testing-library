import React from 'react';
import { fireEvent, render } from 'react-native-testing-library';
import PureNativeModule from './PureNativeModule';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  RN.NativeModules.NativeNotification = {
    show: jest.fn(),
  };

  return RN;
});

// Error thrown by import-order. Ignored due to the mock
// eslint-disable-next-line
import RN from 'react-native';

describe('Pure native component', () => {
  test('show component on show', () => {
    const { getByText } = render(<PureNativeModule />);
    const button = getByText(/Click to show/i);

    fireEvent.press(button);
    expect(RN.NativeModules.NativeNotification.show).toHaveBeenCalled();
  });
});
