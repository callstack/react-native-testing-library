// @flow

import * as React from 'react';
import act from './act';
import {
  ErrorWithStack,
  throwRemovedFunctionError,
  copyStackTrace,
} from './helpers/errors';
import { setTimeout } from './helpers/getTimerFuncs';

const DEFAULT_TIMEOUT = 4500;
const DEFAULT_INTERVAL = 50;

function checkReactVersionAtLeast(major: number, minor: number): boolean {
  if (React.version === undefined) return false;
  const [actualMajor, actualMinor] = React.version.split('.').map(Number);

  return actualMajor > major || (actualMajor === major && actualMinor >= minor);
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
  let interval = options?.interval ?? DEFAULT_INTERVAL;
  // Being able to display a useful stack trace requires generating it before doing anything async
  const stackTraceError = new ErrorWithStack('STACK_TRACE_ERROR', waitFor);

  if (interval < 1) interval = 1;
  const maxTries = Math.ceil(timeout / interval);
  let tries = 0;

  return new Promise((resolve, reject) => {
    const rejectOrRerun = (error) => {
      if (tries > maxTries) {
        copyStackTrace(error, stackTraceError);
        reject(error);
        return;
      }
      setTimeout(runExpectation, interval);
    };
    function runExpectation() {
      tries += 1;
      try {
        const result = Promise.resolve(expectation());
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
    return waitForInternal(expectation, options);
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
