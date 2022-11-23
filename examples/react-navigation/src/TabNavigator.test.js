import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithNavigation } from './test-utils';
import TabNavigator from './TabNavigator';

test('Changing tabs', async () => {
  renderWithNavigation(<TabNavigator />);
  expect(screen.getByRole('header', { name: 'Home screen' })).toBeTruthy();

  //const settingsTab = screen.getByText('Settings');
  screen.debug();
  const settingsTab = screen.getByRole('button', { name: 'Settings' });
  fireEvent.press(settingsTab);

  expect(screen.getByRole('header', { name: 'Settings screen' })).toBeTruthy();
  expect(screen.queryByRole('header', { name: 'Home screen' })).toBeFalsy();
});
