import { resetToDefaults, configure } from './src/pure';
import './src/matchers/extend-expect';

beforeEach(() => {
  resetToDefaults();
  if (process.env.CONCURRENT_MODE === '0') {
    configure({ concurrentRoot: false });
  }
});
