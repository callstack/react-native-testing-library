/* eslint-disable no-undef, import/no-extraneous-dependencies */

// Import Jest Native matchers
import '@testing-library/jest-native/extend-expect';

// Silence the warning: Animated: `useNativeDriver` is not supported because the native animated module is missing
jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

// Setup Reanimated mocking for Drawer navigation
global.ReanimatedDataMock = { now: () => Date.now() };
require('react-native-reanimated/lib/reanimated2/jestUtils').setUpTests();
