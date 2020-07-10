// @flow

import { printDeprecationWarning } from './helpers/errors';

type SimpleThenable = { then: (() => mixed) => mixed };

/**
 * Wait for microtasks queue to flush
 */
export default function flushMicrotasksQueue(): SimpleThenable {
  printDeprecationWarning('flushMicrotasksQueue');
  return flushMicroTasks();
}

// let's try to get node's version of setImmediate, bypassing fake timers if
// any. $FlowFixMe - timers is internal Node module
const enqueueTask = require('timers').setImmediate;

export function flushMicroTasks(): SimpleThenable {
  return {
    then(resolve) {
      enqueueTask(resolve);
    },
  };
}
