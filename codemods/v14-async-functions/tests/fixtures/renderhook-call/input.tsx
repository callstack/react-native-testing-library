import { renderHook } from '@testing-library/react-native';

test('uses renderHook', () => {
  const { result } = renderHook(() => {
    return { value: 42 };
  });
  expect(result.current.value).toBe(42);
});
