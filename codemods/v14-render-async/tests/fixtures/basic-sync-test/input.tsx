import { render, screen } from '@testing-library/react-native';

test('renders component', () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
