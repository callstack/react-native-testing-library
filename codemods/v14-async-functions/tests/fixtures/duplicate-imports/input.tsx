import { render, renderAsync, renderHook, renderHookAsync, fireEvent, fireEventAsync, waitFor } from '@testing-library/react-native';

test('uses both sync and async variants', async () => {
  const component1 = await renderAsync(<MyComponent />);
  const component2 = await render(<MyComponent />);
  
  const { result: result1 } = await renderHookAsync(() => useMyHook());
  const { result: result2 } = await renderHook(() => useMyHook());
  
  await fireEventAsync.press(component1.getByText('Button'));
  await fireEvent.press(component2.getByText('Button'));
  
  await waitFor(() => {
    expect(result1.current.value).toBe(42);
  });
});
