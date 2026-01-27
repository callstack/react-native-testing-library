import { fireEvent } from '@testing-library/react-native';

test('handles events', () => {
  const input = getByTestId('input');
  fireEvent.changeText(input, 'Hello');
  fireEvent.press(input);
  fireEvent.scroll(input);
});
