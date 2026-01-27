import { renderHookAsync } from '@testing-library/react-native';

test('uses destructured rerender and unmount from renderHook', async () => {
  const { rerenderAsync, unmountAsync, result } = await renderHookAsync(() => ({ value: 42 }));
  await rerenderAsync({ value: 43 });
  expect(result.current.value).toBe(43);
  await unmountAsync();
});
