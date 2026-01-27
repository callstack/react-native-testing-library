import { renderHookAsync } from '@testing-library/react-native';

test('rerenders with renderHook result', async () => {
  const hookResult = await renderHookAsync(() => ({ value: 42 }));
  await hookResult.rerenderAsync({ value: 43 });
  expect(hookResult.result.current.value).toBe(43);
});
