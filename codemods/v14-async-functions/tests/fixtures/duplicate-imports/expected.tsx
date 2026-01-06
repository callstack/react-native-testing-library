import { render, renderHook, fireEvent, waitFor } from '@testing-library/react-native';

test('uses both sync and async variants', async () => {
  const component1 = await render(<MyComponent />);
  const component2 = await render(<MyComponent />);
  
  const { result: result1 } = await renderHook(() => useMyHook());
  const { result: result2 } = await renderHook(() => useMyHook());
  
  await fireEvent.press(component1.getByText('Button'));
  await fireEvent.press(component2.getByText('Button'));
  
  await waitFor(() => {
    expect(result1.current.value).toBe(42);
  });
});
