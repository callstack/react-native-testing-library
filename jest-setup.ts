import { resetToDefaults } from './src/pure';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

beforeEach(() => {
  resetToDefaults();
});

// Disable colors in our local tests in order to generate clear snapshots
process.env.COLORS = 'false';
