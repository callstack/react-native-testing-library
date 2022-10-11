import { jestFakeTimersAreEnabled } from '../timers';
describe('timers', () => {
  it('should not mock timers if RNTL_IGNORE_JEST_FAKE_TIMERS is set', async () => {
    process.env.RNTL_IGNORE_JEST_FAKE_TIMERS = 'true';
    jest.useFakeTimers();
    expect(jestFakeTimersAreEnabled()).toEqual(false);
  });
});
