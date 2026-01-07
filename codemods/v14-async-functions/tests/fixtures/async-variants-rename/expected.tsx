import { render, renderHook, fireEvent } from '@testing-library/react-native';

test('uses async variants', async () => {
  const component = await render(<MyComponent />);
  const { result } = await renderHook(() => useMyHook());
  await fireEvent.press(component.getByText('Button'));
});
