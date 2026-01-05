import { clearRenderResult } from './screen';

type CleanUpFunction = () => Promise<void> | void;

const cleanupQueue = new Set<CleanUpFunction>();

export async function cleanup() {
  clearRenderResult();

  for (const fn of cleanupQueue) {
    await fn();
  }

  cleanupQueue.clear();
}

export function addToCleanupQueue(fn: CleanUpFunction) {
  cleanupQueue.add(fn);
}
