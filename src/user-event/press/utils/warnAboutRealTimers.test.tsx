import { warnAboutRealTimers } from './warnAboutRealTimers';

const mockConsoleWarn = jest.spyOn(console, 'warn').mockImplementation();

test('logs a warning about usign real timers with user event', () => {
  warnAboutRealTimers();

  expect(mockConsoleWarn.mock.calls[0][0]).toMatchInlineSnapshot(`
    "It is recommended to use userEvent with fake timers
    Some events involve duration so your tests may take a long time to run.
    For instance calling userEvent.longPress with real timers will take 500 ms."
  `);
});
