import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderNavigator } from './test-utils';
import DrawerNavigator from './DrawerNavigator';

test('Changing screens', () => {
  renderNavigator(<DrawerNavigator />);

  // Assert initial screen
  expect(screen.getByRole('header', { name: 'Home screen' })).toBeOnTheScreen();

  // Open drawer by pressing button
  const toggleButton = screen.getByText('Toggle drawer');
  fireEvent.press(toggleButton);

  // Assert drawer state
  expect(screen.getByRole('button', { name: 'Home' })).toBeSelected();
  expect(screen.getByRole('button', { name: 'Settings' })).not.toBeSelected();

  // Press drawer item
  fireEvent.press(screen.getByRole('button', { name: 'Settings' }));

  // Assert drawer state after action
  expect(screen.getByRole('button', { name: 'Home' })).not.toBeSelected();
  expect(screen.getByRole('button', { name: 'Settings' })).toBeSelected();

  // Assert visible screen
  expect(screen.getByRole('header', { name: 'Settings screen' })).toBeOnTheScreen();
  expect(screen.queryByRole('header', { name: 'Home screen' })).not.toBeOnTheScreen();
});
