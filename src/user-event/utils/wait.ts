type WaitConfig = {
  delay?: number;
  advanceTimers: (delay: number) => Promise<void> | void;
};

export function wait(config: WaitConfig, durationInMs?: number) {
  const delay = durationInMs ?? config.delay;
  if (typeof delay !== 'number' || delay == null) {
    return;
  }

  return Promise.all([
    new Promise<void>((resolve) => globalThis.setTimeout(() => resolve(), delay)),
    config.advanceTimers(delay),
  ]);
}
