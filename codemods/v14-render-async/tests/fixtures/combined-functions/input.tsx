import { render, act, renderHook, screen } from '@testing-library/react-native';

test('uses all three functions', () => {
  render(<MyComponent />);
  
  act(() => {
    // Some state update
  });
  
  const { result } = renderHook(() => {
    return { value: 42 };
  });
  
  expect(screen.getByText('Hello')).toBeOnTheScreen();
  expect(result.current.value).toBe(42);
});
