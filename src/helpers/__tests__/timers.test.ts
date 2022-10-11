import { jestFakeTimersAreEnabled } from '../timers';
describe('timers', () => {
  it('should not mock timers if SKIP_AUTO_FAKE_TIMERS_DETECTION is set', async () => {
    process.env.SKIP_AUTO_FAKE_TIMERS_DETECTION = 'true';
    jest.useFakeTimers();
    expect(jestFakeTimersAreEnabled()).toEqual(false);
  });
});
