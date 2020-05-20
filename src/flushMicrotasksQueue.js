// @flow

import { printDeprecationWarning } from './helpers/errors';

/**
 * Wait for microtasks queue to flush
 */
export default function flushMicrotasksQueue(): Promise<any> {
  printDeprecationWarning('flushMicrotasksQueue');
  return flushMicrotasksQueueInternal();
}

export function flushMicrotasksQueueInternal(): Promise<any> {
  return new Promise((resolve) => setImmediate(resolve));
}
