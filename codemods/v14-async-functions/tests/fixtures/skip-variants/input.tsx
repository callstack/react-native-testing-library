import {
  render,
  act,
  renderHook,
  renderAsync,
} from '@testing-library/react-native';

test('skips unsafe variants', async () => {
  render(<MyComponent />);

  act(() => {
    // Should be transformed
  });

  const { result } = renderHook(() => ({ value: 42 }));

  await renderAsync(<MyComponent />);
});
