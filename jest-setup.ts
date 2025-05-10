import './src/__tests__/setImmediateShim'
import { resetToDefaults, configure } from './src/pure';

beforeEach(() => {
  resetToDefaults();
  if (process.env.CONCURRENT_MODE === '0') {
    configure({ concurrentRoot: false });
  }
});
