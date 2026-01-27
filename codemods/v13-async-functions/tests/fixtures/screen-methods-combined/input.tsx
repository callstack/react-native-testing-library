import { render, screen } from '@testing-library/react-native';

test('uses screen methods', () => {
  render(<MyComponent />);
  screen.rerender(<UpdatedComponent />);
  screen.update(<AnotherComponent />);
  screen.unmount();
});
