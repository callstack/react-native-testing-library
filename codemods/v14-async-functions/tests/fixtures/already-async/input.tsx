import { render, screen } from '@testing-library/react-native';

test('renders component', async () => {
  render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
