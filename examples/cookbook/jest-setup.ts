/* eslint-disable no-undef, import/no-extraneous-dependencies */

// Import built-in Jest matchers
import '@testing-library/react-native/extend-expect';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Guard against API requests made during testing
beforeAll(() => {
  // the global fetch function:
  jest.spyOn(global, 'fetch').mockImplementation(()=> {
    throw Error("Please ensure you mock 'fetch' Only Chuck Norris is allowed to make API requests when testing ;)");
  });
  // with Axios:
  // see examples/cookbook/__mocks__/axios.ts
});
afterAll(() => {
  (global.fetch as jest.Mock).mockRestore();
});
