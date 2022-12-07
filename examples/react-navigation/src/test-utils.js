/* eslint-disable no-undef, import/no-extraneous-dependencies */
import * as React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { render } from '@testing-library/react-native';

/**
 * Render given JSX inside Navigation container.
 * This should be used for rendering whole navigators as used by real app.
 */
export function renderNavigator(ui) {
  return render(<NavigationContainer>{ui}</NavigationContainer>);
}

export function buildNavigationMock() {
  return {
    navigate: jest.fn(),
    reset: jest.fn(),
    goBack: jest.fn(),
    dispatch: jest.fn(),
    isFocused: jest.fn(() => true),
    setParams: jest.fn(),
    setOptions: jest.fn(),
    addListener: jest.fn(),
  };
}
