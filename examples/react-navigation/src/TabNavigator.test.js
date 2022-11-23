import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithNavigation } from './test-utils';
import TabNavigator from './TabNavigator';

test('Changing tabs', () => {
  renderWithNavigation(<TabNavigator />);
  expect(screen.getByRole('header', { name: 'Home screen' })).toBeTruthy();

  // Note: React Navigation uses `button` role for tab buttons as workaround.
  // It should actually be `tab` role.
  const settingsTab = screen.getByRole('button', { name: 'Settings' });
  fireEvent.press(settingsTab);

  expect(screen.getByRole('header', { name: 'Settings screen' })).toBeTruthy();
  expect(screen.queryByRole('header', { name: 'Home screen' })).toBeFalsy();
});
