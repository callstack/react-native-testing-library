import { clearRenderResult } from './screen';

type CleanUpFunction = () => void;
type CleanUpFunctionAsync = () => Promise<void>;

const cleanupQueue = new Set<CleanUpFunction | CleanUpFunctionAsync>();

export default function cleanup() {
  clearRenderResult();

  cleanupQueue.forEach((fn) => fn());
  cleanupQueue.clear();
}

export async function cleanupAsync() {
  clearRenderResult();

  for (const fn of cleanupQueue) {
    await fn();
  }

  cleanupQueue.clear();
}

export function addToCleanupQueue(fn: CleanUpFunction | CleanUpFunctionAsync) {
  cleanupQueue.add(fn);
}