import waitFor from '../waitFor';
import { TimerMode } from './timerUtils';

describe.each([TimerMode.Legacy, TimerMode.Modern])(
  '%s fake timers tests',
  (fakeTimerType) => {
    beforeEach(() => {
      jest.useFakeTimers(fakeTimerType);
    });

    test('it successfully runs tests', () => {
      expect(true).toBeTruthy();
    });

    test('it successfully uses waitFor', async () => {
      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });

    test('it successfully uses waitFor with real timers', async () => {
      jest.useRealTimers();
      await waitFor(() => {
        expect(true).toBeTruthy();
      });
    });
  }
);
