import { render, renderHook, act } from '@testing-library/react-native';

test.each([{ value: 1 }, { value: 2 }])('renders component with value $value', ({ value }) => {
  render(<Component value={value} />);
});

it.each([[true], [false]])('renders hook with flag %p', async (flag) => {
  const { result } = renderHook(() => ({ flag }));
  act(() => {
    // update
  });
});
