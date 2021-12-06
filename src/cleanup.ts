import * as React from 'react';

type CleanUpFunction = (nextElement?: React.ReactElement<any>) => void;
let cleanupQueue = new Set<CleanUpFunction>();

export default function cleanup() {
  cleanupQueue.forEach((fn) => fn());
  cleanupQueue.clear();
}

export function addToCleanupQueue(fn: CleanUpFunction) {
  cleanupQueue.add(fn);
}
