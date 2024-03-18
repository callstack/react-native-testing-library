import * as timersHelper from '../../../helpers/timers';
import { warnAboutRealTimersIfNeeded } from '../warn-about-real-timers';

describe('warnAboutRealTimersIfNeeded()', () => {
  it('warn when RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS is not present and fake timers are not enabled', () => {
    const warnMock = jest.spyOn(console, 'warn').mockImplementation();
    const helperMock = jest.spyOn(timersHelper, 'jestFakeTimersAreEnabled').mockReturnValue(false);

    warnAboutRealTimersIfNeeded();

    expect(warnMock).toHaveBeenCalledWith(
      'It is recommended to use userEvent with fake timers\n' +
        'Some events involve duration so your tests may take a long time to run.\n' +
        'For instance calling userEvent.longPress with real timers will take 500 ms.',
    );

    warnMock.mockRestore();
    helperMock.mockRestore();
  });

  it('never warns when RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS is present', () => {
    const warnMock = jest.spyOn(console, 'warn').mockImplementation();
    process.env.RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS = 'true';

    warnAboutRealTimersIfNeeded();

    expect(warnMock).not.toHaveBeenCalled();

    warnMock.mockRestore();
  });

  it('never warns when fake timers are enabled', () => {
    const warnMock = jest.spyOn(console, 'warn').mockImplementation();
    const helperMock = jest.spyOn(timersHelper, 'jestFakeTimersAreEnabled').mockReturnValue(true);

    warnAboutRealTimersIfNeeded();

    expect(warnMock).not.toHaveBeenCalled();

    warnMock.mockRestore();
    helperMock.mockRestore();
  });
});
