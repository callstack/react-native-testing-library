import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { DetailsScreenContent } from './DetailsScreen';

test('Details screen contains the header and content', () => {
  const item = {
    id: 100,
    title: 'Item 100',
    value: 100,
  };

  const onGoBack = jest.fn();

  // Passing both navigation and route to the screen as props
  render(<DetailsScreenContent item={item} onGoBack={onGoBack} />);

  expect(
    screen.getByRole('header', { name: 'Details for Item 100' })
  ).toBeOnTheScreen();
  expect(
    screen.getByText('The number you have chosen is 100.')
  ).toBeOnTheScreen();

  // Note: Go Back button get navigation from `useNavigation` hook
  fireEvent.press(screen.getByRole('button', { name: 'Go Back' }));
  expect(onGoBack).toHaveBeenCalledTimes(1);
});
