/* eslint-disable no-undef, import/no-extraneous-dependencies */

// Import built-in Jest matchers
import '@testing-library/react-native/extend-expect';
import { server } from './app/network-requests/__tests__/test-utils';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
