// @flow
import { printDeprecationWarning } from './helpers/errors';
import { setImmediate } from './helpers/timers';

type Thenable<T> = { then: (() => T) => mixed };

/**
 * Wait for microtasks queue to flush
 */
export default function flushMicrotasksQueue<T>(): Thenable<T> {
  printDeprecationWarning('flushMicrotasksQueue');
  return flushMicroTasks();
}

export function flushMicroTasks<T>(): Thenable<T> {
  return {
    // using "thenable" instead of a Promise, because otherwise it breaks when
    // using "modern" fake timers
    then(resolve) {
      setImmediate(resolve);
    },
  };
}
