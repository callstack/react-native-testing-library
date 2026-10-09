import { configure } from '../config';

/**
 * Runs tests in the legacy event system in both Jest projects, for legacy behavior the modern
 * event system doesn't have. Call it at the top of a test file, or in a `describe()`.
 */
export function runInLegacyEventSystem() {
  beforeEach(() => {
    configure({ unstable_eventSystem: 'legacy' });
  });
}
