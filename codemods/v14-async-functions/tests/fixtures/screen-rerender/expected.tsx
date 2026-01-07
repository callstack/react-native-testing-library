import { render, screen } from '@testing-library/react-native';

test('rerenders component', async () => {
  await render(<MyComponent />);
  await screen.rerender(<UpdatedComponent />);
  expect(screen.getByText('Updated')).toBeOnTheScreen();
});
