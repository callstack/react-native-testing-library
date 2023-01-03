import * as React from 'react';
import { screen, fireEvent } from '@testing-library/react-native';
import { renderNavigator } from './test-utils';
import StackNavigator from './StackNavigator';

test('Home screen contains the header and list of items', () => {
  renderNavigator(<StackNavigator />);

  expect(screen.getByRole('header', { name: 'Home screen' })).toBeOnTheScreen();
  expect(screen.getAllByRole('button', { name: /Item/ })).toHaveLength(10);

  expect(
    screen.queryByRole('header', { name: /Details for item/i })
  ).not.toBeOnTheScreen();
});

test('Pressing an item takes user to the details screen', () => {
  renderNavigator(<StackNavigator />);

  const item5 = screen.getByRole('button', { name: 'Item 5' });
  fireEvent.press(item5);

  expect(
    screen.getByRole('header', { name: 'Details for Item 5' })
  ).toBeOnTheScreen();
  expect(
    screen.getByText('The number you have chosen is 5.')
  ).toBeOnTheScreen();

  // Home screen is still in the element tree but it is hidden from accessibility
  expect(
    screen.queryByRole('header', { name: 'Home screen' })
  ).not.toBeOnTheScreen();
});
