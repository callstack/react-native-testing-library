// @flow
import waitFor from './waitFor';
import type { WaitForOptions } from './waitFor';

const isRemoved = (result) =>
  !result || (Array.isArray(result) && !result.length);

export default async function waitForElementToBeRemoved<T>(
  expectation: () => T,
  options?: WaitForOptions
): Promise<boolean> {
  // Created here so we get a nice stacktrace
  const timeoutError = new Error('Timed out in waitForElementToBeRemoved.');

  return waitFor(() => {
    let result;
    try {
      result = expectation();
    } catch (error) {
      return true;
    }

    if (!isRemoved(result)) {
      throw timeoutError;
    }

    return true;
  }, options);
}
