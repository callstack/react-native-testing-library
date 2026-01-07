import { renderHook } from '@testing-library/react-native';

test('rerenders with renderHook result', async () => {
  const hookResult = await renderHook(() => ({ value: 42 }));
  await hookResult.rerender({ value: 43 });
  expect(hookResult.result.current.value).toBe(43);
});
