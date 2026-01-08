import { renderHook } from '..';

it('renders a hook with initial props and allows rerendering with new props', async () => {
  const useValue = (value: number) => {
    return { value };
  };

  const { result, rerender } = await renderHook(useValue, {
    initialProps: 5,
  });

  expect(result.current.value).toBe(5);

  await rerender(10);
  expect(result.current.value).toBe(10);
});
