import { resetToDefaults, configure } from './src/pure';
import './src/matchers/extend-expect';

beforeEach(() => {
  resetToDefaults();
  if (process.env.CONCURRENT_MODE === '1') {
    configure({ concurrentRoot: true });
  }
});
