import { clearNativeState } from './native-state';
import { clearRenderResult } from './screen';

type CleanUpFunction = () => void;

const cleanupQueue = new Set<CleanUpFunction>();

export default function cleanup() {
  clearNativeState();
  clearRenderResult();

  cleanupQueue.forEach((fn) => fn());
  cleanupQueue.clear();
}

export function addToCleanupQueue(fn: CleanUpFunction) {
  cleanupQueue.add(fn);
}
