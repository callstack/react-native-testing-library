import { configure } from './src/pure';

// Runs after `resetToDefaults()` in `jest-setup.ts`.
beforeEach(() => {
  configure({ eventSystem: 'modern' });
});
