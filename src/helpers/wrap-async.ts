/* istanbul ignore file */

import { getIsReactActEnvironment, setReactActEnvironment } from '../act';
import { flushMicroTasks } from '../flush-micro-tasks';

/**
 * Run given async callback with temporarily disabled `act` environment and flushes microtasks queue.
 *
 * @param callback Async callback to run
 * @returns Result of the callback
 */
export async function wrapAsync<Result>(callback: () => Promise<Result>): Promise<Result> {
  const previousActEnvironment = getIsReactActEnvironment();
  setReactActEnvironment(false);

  try {
    const result = await callback();
    // Flush the microtask queue before restoring the `act` environment
    await flushMicroTasks();
    return result;
  } finally {
    setReactActEnvironment(previousActEnvironment);
  }
}
