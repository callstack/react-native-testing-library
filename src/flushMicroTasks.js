// @flow

import { printDeprecationWarning } from './helpers/errors';

/**
 * Wait for microtasks queue to flush
 */
export default function flushMicrotasksQueue(): Promise<any> {
  printDeprecationWarning('flushMicrotasksQueue');
  return flushMicroTasks();
}

export function flushMicroTasks(): Promise<any> {
  return new Promise((resolve) => setImmediate(resolve));
}
