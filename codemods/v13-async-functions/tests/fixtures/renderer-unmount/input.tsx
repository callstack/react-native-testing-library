import { render } from '@testing-library/react-native';

test('unmounts with renderer', () => {
  const renderer = render(<MyComponent />);
  renderer.unmount();
});
