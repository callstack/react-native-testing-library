import { act } from 'react-test-renderer';
import { getIsReactActEnvironment, setReactActEnvironment } from '../act';
import { flushMicroTasksLegacy } from '../flush-micro-tasks';
import { checkReactVersionAtLeast } from '../react-versions';

export const asyncWrapper = async <T>(
  callback: () => Promise<T>
): Promise<T> => {
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

  let result: T;

  await act(async () => {
    result = await callback();
  });

  // Either we have result or `waitFor` threw error
  return result!;
};
