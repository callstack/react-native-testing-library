import {
  render,
  act,
  renderHook,
  unsafe_act,
  } from '@testing-library/react-native';

test('skips unsafe variants', async () => {
  await render(<MyComponent />);

  await act(() => {
    // Should be transformed
  });

  unsafe_act(() => {
    // Should NOT be transformed
  });

  const { result } = await renderHook(() => ({ value: 42 }));

  await render(<MyComponent />);
});
