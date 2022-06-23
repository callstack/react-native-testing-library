import * as React from 'react';
import { clearRenderResult } from './screen';

type CleanUpFunction = (nextElement?: React.ReactElement<any>) => void;
let cleanupQueue = new Set<CleanUpFunction>();

export default function cleanup() {
  clearRenderResult();
  cleanupQueue.forEach((fn) => fn());
  cleanupQueue.clear();
}

export function addToCleanupQueue(fn: CleanUpFunction) {
  cleanupQueue.add(fn);
}
