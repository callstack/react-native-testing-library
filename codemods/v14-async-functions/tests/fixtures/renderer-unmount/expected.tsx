import { render } from '@testing-library/react-native';

test('unmounts with renderer', async () => {
  const { rerender, unmount } = await render(<MyComponent />);
  await rerender(<UpdatedComponent />);
  await unmount();
});
