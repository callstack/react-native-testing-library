import { render, renderHook } from '@testing-library/react-native';

test('uses both render and renderHook with rerender', () => {
  const renderer = render(<Component />);
  const { rerender: rerenderHook } = renderHook(() => ({ value: 42 }));

  renderer.rerender(<UpdatedComponent />);
  rerenderHook({ value: 43 });
});
