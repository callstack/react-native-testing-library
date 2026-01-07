import { render, cleanup } from '@testing-library/react-native';

afterEach(() => {
  cleanup();
  render(<CleanupComponent />);
});

test('test case', () => {
  // Test code
});
