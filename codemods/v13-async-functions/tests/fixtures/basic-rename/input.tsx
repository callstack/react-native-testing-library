import { render, renderHook, fireEvent } from '@testing-library/react-native';

test('renders component', () => {
  const component = render(<MyComponent />);
  const { result } = renderHook(() => useMyHook());
  fireEvent.press(component.getByText('Button'));
});
