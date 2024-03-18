import { jestFakeTimersAreEnabled } from '../../helpers/timers';

export const warnAboutRealTimersIfNeeded = () => {
  if (process.env.RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS) {
    return;
  }

  const areFakeTimersEnabled = jestFakeTimersAreEnabled();
  if (areFakeTimersEnabled) {
    return;
  }

  // eslint-disable-next-line no-console
  console.warn(`It is recommended to use userEvent with fake timers
Some events involve duration so your tests may take a long time to run.
For instance calling userEvent.longPress with real timers will take 500 ms.`);
};
