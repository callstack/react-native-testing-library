import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderNavigator } from './test-utils';
import TabNavigator from './TabNavigator';

test('Changing tabs', () => {
  renderNavigator(<TabNavigator />);
  expect(screen.getByRole('header', { name: 'Home screen' })).toBeOnTheScreen();

  // Note: React Navigation uses `button` role for tab buttons as workaround.
  // It should actually be `tab` role.
  const settingsTab = screen.getByRole('button', { name: 'Settings' });
  fireEvent.press(settingsTab);

  expect(
    screen.getByRole('header', { name: 'Settings screen' })
  ).toBeOnTheScreen();
  expect(
    screen.queryByRole('header', { name: 'Home screen' })
  ).not.toBeOnTheScreen();
});
