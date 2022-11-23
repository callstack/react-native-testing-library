import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithNavigation } from './test-utils';
import NativeStackNavigator from './NativeStackNavigator';

test('Home screen contains the header and list of items', () => {
  renderWithNavigation(<NativeStackNavigator />);

  expect(screen.getByRole('header', { name: 'Home screen' })).toBeTruthy();
  expect(screen.getAllByRole('button', { name: /Item/ })).toHaveLength(10);

  expect(
    screen.queryByRole('header', { name: /Details for item/i })
  ).toBeFalsy();
});

test('Pressing an item takes user to the details screen', () => {
  renderWithNavigation(<NativeStackNavigator />);

  const item5 = screen.getByRole('button', { name: 'Item 5' });
  fireEvent.press(item5);

  expect(
    screen.getByRole('header', { name: 'Details for Item 5' })
  ).toBeTruthy();
  expect(screen.getByText('The number you have chosen is 5.')).toBeTruthy();

  // Home screen is still in the element tree but it is hidden from accessibility
  expect(screen.queryByRole('header', { name: 'Home screen' })).toBeFalsy();
});
