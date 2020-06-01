import React from 'react';
import { render, fireEvent } from 'react-native-testing-library';
import { UIManager } from 'react-native';
import App from './App';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');

  RN.UIManager.getViewManagerConfig = (name) => {
    if (name === 'PureButton') {
      return { onPress: jest.fn() };
    }
  };

  return RN;
});

describe('Testing Pure button', () => {
  test('expect RN to be truthy', async () => {
    const { getByAccessibilityHint } = render(<App />);
    const sample = getByAccessibilityHint('sample');

    fireEvent.press(sample);

    expect(
      UIManager.getViewManagerConfig('PureButton').onPress
    ).toHaveBeenCalled();
  });
});
