import { fireEventAsync } from '@testing-library/react-native';

test('handles events', async () => {
  const input = getByTestId('input');
  await fireEventAsync.changeText(input, 'Hello');
  await fireEventAsync.press(input);
  await fireEventAsync.scroll(input);
});
