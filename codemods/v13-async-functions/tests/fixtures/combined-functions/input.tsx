import { render, renderHook, fireEvent } from '@testing-library/react-native';

test('combined usage', async () => {
  const component = await render(<MyComponent />);
  const { result, rerender } = await renderHook(() => useMyHook());
  await fireEvent.press(component.getByText('Button'));
  await fireEvent.changeText(component.getByPlaceholderText('Input'), 'Text');
});
