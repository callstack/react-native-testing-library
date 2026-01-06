import { renderHook } from '@testing-library/react-native';

test('uses renderHook', async () => {
  const { result } = await renderHook(() => {
    return { value: 42 };
  });
  expect(result.current.value).toBe(42);
});
