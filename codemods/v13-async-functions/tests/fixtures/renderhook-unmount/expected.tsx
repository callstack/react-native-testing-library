import { renderHookAsync } from '@testing-library/react-native';

test('unmounts with renderHook result', async () => {
  const hookResult = await renderHookAsync(() => ({ value: 42 }));
  await hookResult.unmountAsync();
});
