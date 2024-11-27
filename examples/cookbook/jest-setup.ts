import { configure } from '@testing-library/react-native';

// Import built-in Jest matchers
import '@testing-library/react-native/extend-expect';
import { server } from './app/network-requests/__tests__/test-utils';

// Enable API mocking via Mock Service Worker (MSW)
beforeAll(() => server.listen());

// Reset any runtime request handlers we may add during the tests
afterEach(() => server.resetHandlers());

// Disable API mocking after the tests are done
afterAll(() => server.close());

configure({ concurrentRoot: true });
