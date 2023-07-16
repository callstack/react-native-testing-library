export const warnAboutRealTimers = () => {
  // eslint-disable-next-line no-console
  console.warn(`It is recommended to use userEvent with fake timers
Some events involve duration so your tests may take a long time to run.
For instance calling userEvent.longPress with real timers will take 500 ms.`);
};
