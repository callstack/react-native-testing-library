import { render } from '@testing-library/react-native';

test('uses assignment expression with render', () => {
  let renderer;
  renderer = render(<MyComponent />);
  renderer.rerender(<UpdatedComponent />);
});
