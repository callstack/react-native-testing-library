// @flow

import { printDeprecationWarning } from './helpers/errors';

type Thenable = { then: (() => mixed) => mixed };

/**
 * Wait for microtasks queue to flush
 */
export default function flushMicrotasksQueue(): Thenable {
  printDeprecationWarning('flushMicrotasksQueue');
  return flushMicroTasks();
}

// let's try to get node's version of setImmediate, bypassing fake timers if
// any. $FlowFixMe - timers is internal Node module
const enqueueTask = require('timers').setImmediate;

export function flushMicroTasks(): Thenable {
  return {
    then(resolve) {
      enqueueTask(resolve);
    },
  };
}
