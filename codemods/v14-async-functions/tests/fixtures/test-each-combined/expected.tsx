import { render, renderHook, act } from '@testing-library/react-native';

test.each([
  { value: 1 },
  { value: 2 },
])('renders component with value $value', async ({ value }) => {
  await render(<Component value={value} />);
});

it.each([
  [true],
  [false],
])('renders hook with flag %p', async (flag) => {
  const { result } = await renderHook(() => ({ flag }));
  await act(() => {
    // update
  });
});
