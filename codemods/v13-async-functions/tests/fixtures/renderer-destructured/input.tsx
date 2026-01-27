import { render } from '@testing-library/react-native';

test('uses destructured rerender and unmount from render', () => {
  const { rerender, unmount } = render(<MyComponent />);
  rerender(<UpdatedComponent />);
  unmount();
});
