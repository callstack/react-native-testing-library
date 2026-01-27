import { render, screen } from '@testing-library/react-native';

test('updates component', () => {
  render(<MyComponent />);
  screen.update(<UpdatedComponent />);
  expect(screen.getByText('Updated')).toBeOnTheScreen();
});
