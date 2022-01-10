// @flow
/* globals jest */

import * as React from 'react';
import act from './act';
import {
  ErrorWithStack,
  throwRemovedFunctionError,
  copyStackTrace,
} from './helpers/errors';
import {
  setTimeout,
  clearTimeout,
  setImmediate,
  jestFakeTimersAreEnabled,
} from './helpers/timers';

const DEFAULT_TIMEOUT = 1000;
const DEFAULT_INTERVAL = 50;

function checkReactVersionAtLeast(major: number, minor: number): boolean {
  if (React.version === undefined) return false;
  const [actualMajor, actualMinor] = React.version.split('.').map(Number);

  return actualMajor > major || (actualMajor === major && actualMinor >= minor);
}

export type WaitForOptions = {
  timeout?: number,
  interval?: number,
  stackTraceError?: ErrorWithStack,
  onTimeout?: (error: Error) => Error,
};

function waitForInternal<T>(
  expectation: () => T,
  {
    timeout = DEFAULT_TIMEOUT,
    interval = DEFAULT_INTERVAL,
    stackTraceError,
    onTimeout,
  }: WaitForOptions
): Promise<T> {
  if (typeof expectation !== 'function') {
    throw new TypeError('Received `expectation` arg must be a function');
  }

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    let lastError, intervalId;
    let finished = false;
    let promiseStatus = 'idle';

    const overallTimeoutTimer = setTimeout(handleTimeout, timeout);

    const usingFakeTimers = jestFakeTimersAreEnabled();

    if (usingFakeTimers) {
      checkExpectation();
      // this is a dangerous rule to disable because it could lead to an
      // infinite loop. However, eslint isn't smart enough to know that we're
      // setting finished inside `onDone` which will be called when we're done
      // waiting or when we've timed out.
      // eslint-disable-next-line no-unmodified-loop-condition
      let fakeTimeRemaining = timeout;
      while (!finished) {
        if (!jestFakeTimersAreEnabled()) {
          const error = new Error(
            `Changed from using fake timers to real timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to real timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`
          );
          if (stackTraceError) {
            copyStackTrace(error, stackTraceError);
          }
          reject(error);
          return;
        }

        // when fake timers are used we want to simulate the interval time passing
        if (fakeTimeRemaining <= 0) {
          return;
        } else {
          fakeTimeRemaining -= interval;
        }

        // we *could* (maybe should?) use `advanceTimersToNextTimer` but it's
        // possible that could make this loop go on forever if someone is using
        // third party code that's setting up recursive timers so rapidly that
        // the user's timer's don't get a chance to resolve. So we'll advance
        // by an interval instead. (We have a test for this case).
        jest.advanceTimersByTime(interval);

        // It's really important that checkExpectation is run *before* we flush
        // in-flight promises. To be honest, I'm not sure why, and I can't quite
        // think of a way to reproduce the problem in a test, but I spent
        // an entire day banging my head against a wall on this.
        checkExpectation();

        // In this rare case, we *need* to wait for in-flight promises
        // to resolve before continuing. We don't need to take advantage
        // of parallelization so we're fine.
        // https://stackoverflow.com/a/59243586/971592
        // eslint-disable-next-line no-await-in-loop
        await new Promise((resolve) => setImmediate(resolve));
      }
    } else {
      intervalId = setInterval(checkRealTimersCallback, interval);
      checkExpectation();
    }

    function onDone(error, result) {
      finished = true;
      clearTimeout(overallTimeoutTimer);

      if (!usingFakeTimers) {
        clearInterval(intervalId);
      }

      if (error) {
        reject(error);
      } else {
        // $FlowIgnore[incompatible-return] error and result are mutually exclusive
        resolve(result);
      }
    }

    function checkRealTimersCallback() {
      if (jestFakeTimersAreEnabled()) {
        const error = new Error(
          `Changed from using real timers to fake timers while using waitFor. This is not allowed and will result in very strange behavior. Please ensure you're awaiting all async things your test is doing before changing to fake timers. For more info, please go to https://github.com/testing-library/dom-testing-library/issues/830`
        );
        if (stackTraceError) {
          copyStackTrace(error, stackTraceError);
        }
        return reject(error);
      } else {
        return checkExpectation();
      }
    }

    function checkExpectation() {
      if (promiseStatus === 'pending') return;
      try {
        const result = expectation();

        // $FlowIgnore[incompatible-type]
        if (typeof result?.then === 'function') {
          promiseStatus = 'pending';
          // eslint-disable-next-line promise/catch-or-return
          result.then(
            (resolvedValue) => {
              promiseStatus = 'resolved';
              onDone(null, resolvedValue);
              return;
            },
            (rejectedValue) => {
              promiseStatus = 'rejected';
              lastError = rejectedValue;
              return;
            }
          );
        } else {
          onDone(null, result);
        }
        // If `callback` throws, wait for the next mutation, interval, or timeout.
      } catch (error) {
        // Save the most recent callback error to reject the promise with it in the event of a timeout
        lastError = error;
      }
    }

    function handleTimeout() {
      let error;
      if (lastError) {
        error = lastError;
        if (stackTraceError) {
          copyStackTrace(error, stackTraceError);
        }
      } else {
        error = new Error('Timed out in waitFor.');
        if (stackTraceError) {
          copyStackTrace(error, stackTraceError);
        }
      }
      if (typeof onTimeout === 'function') {
        onTimeout(error);
      }
      onDone(error, null);
    }
  });
}

export default async function waitFor<T>(
  expectation: () => T,
  options?: WaitForOptions
): Promise<T> {
  // Being able to display a useful stack trace requires generating it before doing anything async
  const stackTraceError = new ErrorWithStack('STACK_TRACE_ERROR', waitFor);
  const optionsWithStackTrace = { stackTraceError, ...options };

  if (!checkReactVersionAtLeast(16, 9)) {
    return waitForInternal(expectation, optionsWithStackTrace);
  }

  let result: T;

  //$FlowFixMe: `act` has incorrect flow typing
  await act(async () => {
    result = await waitForInternal(expectation, optionsWithStackTrace);
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
