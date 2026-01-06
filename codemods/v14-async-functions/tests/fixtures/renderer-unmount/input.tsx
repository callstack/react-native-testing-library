import { render } from '@testing-library/react-native';

test('unmounts with renderer', () => {
  const { rerender, unmount } = render(<MyComponent />);
  rerender(<UpdatedComponent />);
  unmount();
});
