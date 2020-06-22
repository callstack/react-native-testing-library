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

let enqueueTask;
try {
  // assuming we're in node, let's try to get node's
  // version of setImmediate, bypassing fake timers if any.
  // $FlowFixMe - timers is internal Node module
  enqueueTask = require('timers').setImmediate;
} catch (_err) {
  // we're in a browser, do nothing
  enqueueTask = (resolve) => {
    resolve();
  };
}

export function flushMicroTasks(): SimpleThenable {
  return {
    then(resolve) {
      enqueueTask(resolve);
    },
  };
}
