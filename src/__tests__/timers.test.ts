import waitFor from '../waitFor';

describe.each([false, true])(
  'fake timers tests (legacyFakeTimers = %s)',
  (legacyFakeTimers) => {
    beforeEach(() => {
      jest.useFakeTimers({ legacyFakeTimers });
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
