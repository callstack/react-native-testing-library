import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { useNavigation } from '@react-navigation/native';
import { buildNavigationMock } from '../test-utils';
import DetailsScreen from './DetailsScreen';

jest.mock('@react-navigation/native', () => {
  const originalModule = jest.requireActual('@react-navigation/native');

  return {
    ...originalModule,
    useNavigation: jest.fn(),
  };
});

let navigation;

// Reset navigation before each test
beforeEach(() => {
  navigation = buildNavigationMock();
  useNavigation.mockImplementation(() => navigation);
});

test('Details screen contains the header and content', () => {
  const params = {
    id: 100,
    title: 'Item 100',
    value: 100,
  };

  // Passing both navigation and route to the screen as props
  render(<DetailsScreen navigation={navigation} route={{ params }} />);

  expect(
    screen.getByRole('header', { name: 'Details for Item 100' })
  ).toBeTruthy();
  expect(screen.getByText('The number you have chosen is 100.')).toBeTruthy();

  // Note: Go Back button get navigation from `useNavigation` hook
  fireEvent.press(screen.getByRole('button', { name: 'Go Back' }));
  expect(navigation.goBack).toHaveBeenCalledTimes(1);
});
