import { render, screen } from '@testing-library/react-native';

test('rerenders component', () => {
  render(<MyComponent />);
  screen.rerender(<UpdatedComponent />);
  expect(screen.getByText('Updated')).toBeOnTheScreen();
});
