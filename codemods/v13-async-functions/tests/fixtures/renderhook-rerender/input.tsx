import { renderHook } from '@testing-library/react-native';

test('rerenders with renderHook result', () => {
  const hookResult = renderHook(() => ({ value: 42 }));
  hookResult.rerender({ value: 43 });
  expect(hookResult.result.current.value).toBe(43);
});
