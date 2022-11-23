import { screen } from '@testing-library/react-native';
import { renderScreenWithParams } from '../test-utils';
import DetailsScreen from './DetailsScreen';

test('Details screen contains the header and content', () => {
  const item = {
    id: 100,
    title: 'Item 100',
    value: 100,
  };
  renderScreenWithParams(DetailsScreen, item);

  expect(
    screen.getByRole('header', { name: 'Details for Item 100' })
  ).toBeTruthy();
  expect(screen.getByText('The number you have chosen is 100.')).toBeTruthy();
});
