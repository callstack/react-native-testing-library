import { renderAsync, renderHookAsync, fireEventAsync } from '@testing-library/react-native';

test('uses async variants', async () => {
  const component = await renderAsync(<MyComponent />);
  const { result } = await renderHookAsync(() => useMyHook());
  await fireEventAsync.press(component.getByText('Button'));
});
