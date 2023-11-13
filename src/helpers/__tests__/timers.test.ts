import { jestFakeTimersAreEnabled } from '../timers';
describe('timers', () => {
  it('should not mock timers if RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS is set', () => {
    process.env.RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS = 'true';
    jest.useFakeTimers();
    expect(jestFakeTimersAreEnabled()).toEqual(false);
  });
});
