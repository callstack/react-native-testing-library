import { render, screen } from '@testing-library/react-native';

test('unmounts component', () => {
  render(<MyComponent />);
  screen.unmount();
  expect(screen.queryByText('Hello')).not.toBeOnTheScreen();
});
