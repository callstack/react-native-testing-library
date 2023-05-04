export const warnAboutRealTimers = () => {
  // eslint-disable-next-line no-console
  console.warn(`It is not recommended to use userEvent without using fake timers
Some events involve duration so your tests may take a long time to run.
For instance calling userEvent.longPress with real timers will take 500ms`);
};
