/* istanbul ignore file */

import act, { getIsReactActEnvironment, setReactActEnvironment } from '../act';
import { flushMicroTasksLegacy } from '../flush-micro-tasks';
import { checkReactVersionAtLeast } from '../react-versions';

/**
 * Run given async callback with temporarily disabled `act` environment and flushes microtasks queue.
 * See: https://github.com/testing-library/react-testing-library/blob/3dcd8a9649e25054c0e650d95fca2317b7008576/src/pure.js#L37
 *
 * @param callback Async callback to run
 * @returns Result of the callback
 */
export async function wrapAsync<Result>(callback: () => Promise<Result>): Promise<Result> {
  if (checkReactVersionAtLeast(18, 0)) {
    const previousActEnvironment = getIsReactActEnvironment();
    setReactActEnvironment(false);

    try {
      const result = await callback();
      // Flush the microtask queue before restoring the `act` environment
      await flushMicroTasksLegacy();
      return result;
    } finally {
      setReactActEnvironment(previousActEnvironment);
    }
  }

  if (!checkReactVersionAtLeast(16, 9)) {
    return callback();
  }

  // Wrapping with act for react version 16.9 to 17.x
  let result: Result;
  await act(async () => {
    result = await callback();
  });

  // Either we have result or `callback` threw error
  return result!;
}
