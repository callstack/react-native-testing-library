import { jestFakeTimersAreEnabled } from '../timers';
describe('timers', () => {
  it('should not mock timers if RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS is set', () => {
    process.env.RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS = 'true';
    jest.useFakeTimers();
    expect(jestFakeTimersAreEnabled()).toEqual(false);
  });

  it('setImmediate polyfill keeps using real timers when fake timers are enabled', async () => {
    // Regression test for https://github.com/callstack/react-native-testing-library/issues/1767.
    // The module captures its timer functions once at import time. When the environment
    // has no native `setImmediate` (e.g. jsdom/browser) it falls back to a polyfill built
    // on `setTimeout`; that `setTimeout` must be the real one, so the polyfill keeps
    // working after fake timers are re-applied (as happens during auto-cleanup).
    delete process.env.RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS;
    jest.useRealTimers();

    // Simulate a missing native `setImmediate` before the module captures its functions.
    const originalSetImmediate = globalThis.setImmediate;
    // @ts-expect-error force the polyfill fallback
    delete globalThis.setImmediate;

    let setImmediate!: (fn: () => void) => unknown;
    try {
      jest.isolateModules(() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        setImmediate = require('../timers').setImmediate;
      });
    } finally {
      globalThis.setImmediate = originalSetImmediate;
    }

    jest.useFakeTimers({ legacyFakeTimers: false });
    try {
      // Before the fix this never resolved (the polyfill read the fake `setTimeout`),
      // so the test would hang until the Jest timeout.
      const resolved = await new Promise<boolean>((resolve) => setImmediate(() => resolve(true)));
      expect(resolved).toBe(true);
    } finally {
      jest.useRealTimers();
    }
  }, 10_000);
});
