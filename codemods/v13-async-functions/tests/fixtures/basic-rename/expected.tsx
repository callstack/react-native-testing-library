import { renderAsync, renderHookAsync, fireEventAsync } from '@testing-library/react-native';

test('renders component', async () => {
  const component = await renderAsync(<MyComponent />);
  const { result } = await renderHookAsync(() => useMyHook());
  await fireEventAsync.press(component.getByText('Button'));
});
