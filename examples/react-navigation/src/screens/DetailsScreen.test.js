import * as React from 'react';
import { render, screen, fireEvent } from '@testing-library/react-native';
import { buildNavigationMock } from '../test-utils';
import DetailsScreen from './DetailsScreen';

test('Details screen contains the header and content', () => {
  const navigation = buildNavigationMock();
  const params = {
    id: 100,
    title: 'Item 100',
    value: 100,
  };

  render(<DetailsScreen navigation={navigation} route={{ params }} />);

  expect(
    screen.getByRole('header', { name: 'Details for Item 100' })
  ).toBeTruthy();
  expect(screen.getByText('The number you have chosen is 100.')).toBeTruthy();

  fireEvent.press(screen.getByRole('button', { name: 'Go back' }));
  expect(navigation.goBack).toHaveBeenCalledTimes(1);
});
