import { act } from '@testing-library/react-native';

test('uses act', async () => {
  await act(() => {
    // Some state update
  });
  expect(true).toBe(true);
});
