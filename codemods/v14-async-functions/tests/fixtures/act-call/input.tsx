import { act } from '@testing-library/react-native';

test('uses act', () => {
  act(() => {
    // Some state update
  });
  expect(true).toBe(true);
});
