import { render, act, renderHook, screen } from '@testing-library/react-native';

test('uses all three functions', async () => {
  await render(<MyComponent />);

  await act(() => {
    // Some state update
  });

  const { result } = await renderHook(() => {
    return { value: 42 };
  });

  expect(screen.getByText('Hello')).toBeOnTheScreen();
  expect(result.current.value).toBe(42);
});
