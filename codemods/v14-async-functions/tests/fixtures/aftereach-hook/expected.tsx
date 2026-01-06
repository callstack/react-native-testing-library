import { render, cleanup } from '@testing-library/react-native';

afterEach(async () => {
  cleanup();
  await render(<CleanupComponent />);
});

test('test case', () => {
  // Test code
});
