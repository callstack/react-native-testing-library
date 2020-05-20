import React from 'react';
import { NativeModules } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';
import PureNativeModule from './PureNativeModule';

jest.spyOn(NativeModules, 'NativeNotification', () => ({
  show: jest.fn(),
}));

describe('Pure native component', () => {
  test('show component on show', () => {
    const { getByText } = render(<PureNativeModule />);
    const button = getByText(/Click to show/i);

    fireEvent.press(button);
    expect(NativeModules.NativeNotification.show).toHaveBeenCalled();
  });
});
