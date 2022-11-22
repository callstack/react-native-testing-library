import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderWithNavigation } from './test-utils';
import StackNavigator from './StackNavigator';

test('Home screen contains the header and list of items', async () => {
  renderWithNavigation(<StackNavigator />);

  expect(screen.getByRole('header', { name: 'Home screen' })).toBeTruthy();
  expect(screen.getAllByText(/Item/)).toHaveLength(10);

  expect(
    screen.queryByRole('header', { name: /Details for item/i })
  ).toBeFalsy();
});

test('Pressing an item takes user to the details screen', async () => {
  renderWithNavigation(<StackNavigator />);

  const item5 = screen.getByText('Item 5');
  fireEvent(item5, 'press');

  expect(
    screen.getByRole('header', { name: 'Details for Item 5' })
  ).toBeTruthy();
  expect(screen.getByText('The number you have chosen is 5.')).toBeTruthy();

  // Home screen is still in the element tree but it is hidden from accessibility
  expect(screen.queryByRole('header', { name: 'Home screen' })).toBeFalsy();
});
