import { UserEventConfig } from '../setup';

export function wait(config: UserEventConfig, durationInMs?: number) {
  const delay = durationInMs ?? config.delay;
  if (typeof delay !== 'number') {
    return;
  }

  return Promise.all([
    new Promise<void>((resolve) =>
      globalThis.setTimeout(() => resolve(), delay)
    ),
    config.advanceTimers(delay),
  ]);
}
