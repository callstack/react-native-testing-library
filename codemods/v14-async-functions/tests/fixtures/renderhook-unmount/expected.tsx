import { renderHook } from '@testing-library/react-native';

test('unmounts with renderHook result', async () => {
  const hookResult = await renderHook(() => ({ value: 42 }));
  await hookResult.unmount();
});
