import { renderAsync, renderHookAsync, fireEventAsync } from '@testing-library/react-native';

test('combined usage', async () => {
  const component = await renderAsync(<MyComponent />);
  const { result, rerender } = await renderHookAsync(() => useMyHook());
  await fireEventAsync.press(component.getByText('Button'));
  await fireEventAsync.changeText(component.getByPlaceholderText('Input'), 'Text');
});
