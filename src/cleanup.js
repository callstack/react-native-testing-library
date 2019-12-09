// @flow
let cleanupQueue = new Set();

export default function cleanup() {
  cleanupQueue.forEach(fn => fn());
  cleanupQueue.clear();
}

export function addToCleanupQueue(
  fn: (nextElement?: React$Element<any>) => void
) {
  cleanupQueue.add(fn);
}
