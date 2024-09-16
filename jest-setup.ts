import { configure, resetToDefaults } from './src/pure';

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper');

beforeEach(() => {
  resetToDefaults();
  configure({ renderer: 'internal' });
});
