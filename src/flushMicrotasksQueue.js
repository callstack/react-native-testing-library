// @flow
/**
 * Wait for microtasks queue to flush
 */
export default function flushMicrotasksQueue(): Promise<any> {
  return new Promise(resolve => setImmediate(resolve));
}
