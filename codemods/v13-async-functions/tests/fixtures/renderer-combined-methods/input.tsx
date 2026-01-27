import { render } from '@testing-library/react-native';

test('uses multiple methods on renderer', () => {
  const renderer = render(<MyComponent />);
  renderer.rerender(<UpdatedComponent />);
  renderer.update(<AnotherComponent />);
  renderer.unmount();
});
