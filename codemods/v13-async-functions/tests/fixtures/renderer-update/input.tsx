import { render } from '@testing-library/react-native';

test('updates with renderer', () => {
  const renderer = render(<MyComponent />);
  renderer.update(<UpdatedComponent />);
});
