import { renderHook } from '@testing-library/react-native';

test('uses destructured rerender and unmount from renderHook', () => {
  const { rerender, unmount, result } = renderHook(() => ({ value: 42 }));
  rerender({ value: 43 });
  expect(result.current.value).toBe(43);
  unmount();
});
