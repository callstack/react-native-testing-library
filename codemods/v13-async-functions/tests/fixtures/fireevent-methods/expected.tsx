import { fireEventAsync } from '@testing-library/react-native';

test('handles events', () => {
  const input = getByTestId('input');
  fireEventAsync.changeText(input, 'Hello');
  fireEventAsync.press(input);
  fireEventAsync.scroll(input);
});
