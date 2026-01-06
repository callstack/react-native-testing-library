import { render, renderHook } from '@testing-library/react-native';

test('uses both render and renderHook with rerender', async () => {
  const renderer = await render(<Component />);
  const { rerender: rerenderHook } = await renderHook(() => ({ value: 42 }));
  
  await renderer.rerender(<UpdatedComponent />);
  await rerenderHook({ value: 43 });
});
