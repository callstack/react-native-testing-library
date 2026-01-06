import { render, screen } from '@testing-library/react-native';

test('renders component', async () => {
  await render(<MyComponent />);
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
