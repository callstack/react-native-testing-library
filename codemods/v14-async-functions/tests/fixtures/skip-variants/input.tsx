import {
  render,
  act,
  renderHook,
  unsafe_act,
  unsafe_renderHookSync,
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

  unsafe_renderHookSync(() => ({ value: 43 }));

  await renderAsync(<MyComponent />);
});
