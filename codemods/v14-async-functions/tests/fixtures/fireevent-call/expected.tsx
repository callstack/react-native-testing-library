import { fireEvent, render, screen } from '@testing-library/react-native';

test('uses fireEvent', async () => {
  await render(<MyComponent />);
  const button = screen.getByRole('button');
  await fireEvent(button, 'press');
  expect(screen.getByText('Clicked')).toBeOnTheScreen();
});
