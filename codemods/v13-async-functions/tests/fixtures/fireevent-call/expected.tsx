import { fireEventAsync, renderAsync, screen } from '@testing-library/react-native';

test('uses fireEvent', async () => {
  await renderAsync(<MyComponent />);
  const button = screen.getByRole('button');
  await fireEventAsync(button, 'press');
  expect(screen.getByText('Clicked')).toBeOnTheScreen();
});
