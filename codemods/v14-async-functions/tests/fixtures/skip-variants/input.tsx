import {
  render,
  act,
  renderHook,
  unsafe_act,
  renderAsync,
} from '@testing-library/react-native';

test('skips unsafe variants', async () => {
  render(<MyComponent />);

  act(() => {
    // Should be transformed
  });

  unsafe_act(() => {
    // Should NOT be transformed
  });

  const { result } = renderHook(() => ({ value: 42 }));

  await renderAsync(<MyComponent />);
});
