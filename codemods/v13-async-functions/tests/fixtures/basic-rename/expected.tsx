import { renderAsync, renderHookAsync, fireEventAsync } from '@testing-library/react-native';

test('renders component', () => {
  const component = renderAsync(<MyComponent />);
  const { result } = renderHookAsync(() => useMyHook());
  fireEventAsync.press(component.getByText('Button'));
});
