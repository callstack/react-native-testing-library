/* globals jest */
import act, { setReactActEnvironment, getIsReactActEnvironment } from './act';
import { getConfig } from './config';
import { flushMicroTasks, flushMicroTasksLegacy } from './flush-micro-tasks';
import { ErrorWithStack, copyStackTrace } from './helpers/errors';
import {
  setTimeout,
  clearTimeout,
  jestFakeTimersAreEnabled,
} from './helpers/timers';
import { checkReactVersionAtLeast } from './react-versions';

const DEFAULT_INTERVAL = 50;

export type WaitForOptions = {
  timeout?: number;
  interval?: number;
  stackTraceError?: ErrorWithStack;
  onTimeout?: (error: Error) => Error;
};

function waitForInternal<T>(
  expectation: () => T,
  {
    timeout = getConfig().asyncUtilTimeout,
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
    let lastError: unknown, intervalId: ReturnType<typeof setTimeout>;
    let finished = false;
    let promiseStatus = 'idle';

    let overallTimeoutTimer: NodeJS.Timeout | null = null;

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
          handleTimeout();
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
        await flushMicroTasks();
      }
    } else {
      overallTimeoutTimer = setTimeout(handleTimeout, timeout);
      intervalId = setInterval(checkRealTimersCallback, interval);
      checkExpectation();
    }

    function onDone(
      done: { type: 'result'; result: T } | { type: 'error'; error: unknown }
    ) {
      finished = true;
      if (overallTimeoutTimer) {
        clearTimeout(overallTimeoutTimer);
      }

      if (!usingFakeTimers) {
        clearInterval(intervalId);
      }

      if (done.type === 'error') {
        reject(done.error);
      } else {
        resolve(done.result);
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

        // @ts-ignore result can be a promise
        // eslint-disable-next-line promise/prefer-await-to-then
        if (typeof result?.then === 'function') {
          const promiseResult: Promise<T> = result as any;
          promiseStatus = 'pending';
          // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
          promiseResult.then(
            (resolvedValue) => {
              promiseStatus = 'resolved';
              onDone({ type: 'result', result: resolvedValue });
              return;
            },
            (rejectedValue) => {
              promiseStatus = 'rejected';
              lastError = rejectedValue;
              return;
            }
          );
        } else {
          onDone({ type: 'result', result: result });
        }
        // If `callback` throws, wait for the next mutation, interval, or timeout.
      } catch (error) {
        // Save the most recent callback error to reject the promise with it in the event of a timeout
        lastError = error;
      }
    }

    function handleTimeout() {
      let error: Error;
      if (lastError) {
        if (lastError instanceof Error) {
          error = lastError;
        } else {
          error = new Error(String(lastError));
        }

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
        const result = onTimeout(error);
        if (result) {
          error = result;
        }
      }
      onDone({ type: 'error', error });
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

  if (checkReactVersionAtLeast(18, 0)) {
    const previousActEnvironment = getIsReactActEnvironment();
    setReactActEnvironment(false);

    try {
      const result = await waitForInternal(expectation, optionsWithStackTrace);
      // Flush the microtask queue before restoring the `act` environment
      await flushMicroTasksLegacy();
      return result;
    } finally {
      setReactActEnvironment(previousActEnvironment);
    }
  }

  if (!checkReactVersionAtLeast(16, 9)) {
    return waitForInternal(expectation, optionsWithStackTrace);
  }

  let result: T;

  await act(async () => {
    result = await waitForInternal(expectation, optionsWithStackTrace);
  });

  // Either we have result or `waitFor` threw error
  return result!;
}
