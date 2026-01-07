import { renderHook } from '@testing-library/react-native';

test('uses destructured rerender and unmount from renderHook', async () => {
  const { rerender, unmount, result } = await renderHook(() => ({ value: 42 }));
  await rerender({ value: 43 });
  expect(result.current.value).toBe(43);
  await unmount();
});
