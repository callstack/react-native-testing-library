// @flow

import React from 'react';
import act from './act';
import { throwRemovedFunctionError } from './helpers/errors';

const DEFAULT_TIMEOUT = 4500;
const DEFAULT_INTERVAL = 50;

function checkReactVersionAtLeast(major: number, minor: number): boolean {
  if (React.version === undefined) return false;
  const [actualMajor, actualMinor] = React.version
    .split('.')
    .map((n) => parseInt(n, 10));

  return actualMajor > major || (actualMajor == major && actualMinor >= minor);
}

export type WaitForOptions = {
  timeout?: number,
  interval?: number,
};

function waitForInternal<T>(
  expectation: () => T,
  options?: WaitForOptions
): Promise<T> {
  const timeout = options?.timeout ?? DEFAULT_TIMEOUT;
  const interval = options?.interval ?? DEFAULT_INTERVAL;
  const startTime = Date.now();

  return new Promise((resolve, reject) => {
    const rejectOrRerun = (error) => {
      if (Date.now() - startTime >= timeout) {
        reject(error);
        return;
      }
      setTimeout(runExpectation, interval);
    };
    function runExpectation() {
      try {
        const result = expectation();
        resolve(result);
      } catch (error) {
        rejectOrRerun(error);
      }
    }
    setTimeout(runExpectation, 0);
  });
}

export default async function waitFor<T>(
  expectation: () => T,
  options?: WaitForOptions
): Promise<T> {
  if (!checkReactVersionAtLeast(16, 9)) {
    return await waitForInternal(expectation, options);
  }

  let result: T;

  //$FlowFixMe: `act` has incorrect flow typing
  await act(async () => {
    result = await waitForInternal(expectation, options);
  });

  //$FlowFixMe: either we have result or `waitFor` threw error
  return result;
}

export function waitForElement<T>(
  expectation: () => T,
  _timeout: number = 4500,
  _interval: number = 50
): Promise<T> {
  throwRemovedFunctionError(
    'waitForElement',
    'migration-v2#waitfor-api-changes'
  );

  return Promise.reject();
}
