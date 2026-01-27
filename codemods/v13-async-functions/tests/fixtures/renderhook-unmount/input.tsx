import { renderHook } from '@testing-library/react-native';

test('unmounts with renderHook result', () => {
  const hookResult = renderHook(() => ({ value: 42 }));
  hookResult.unmount();
});
