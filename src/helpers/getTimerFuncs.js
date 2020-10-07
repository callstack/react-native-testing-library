/* eslint-disable no-undef */

// Contents of this file sourced directly from https://github.com/testing-library/dom-testing-library/blob/master/src/helpers.js

const globalObj = typeof window === 'undefined' ? global : window;

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers(callback) {
  const fakeTimersType = getJestFakeTimersType();
  if (fakeTimersType) {
    jest.useRealTimers();
  }

  const callbackReturnValue = callback();

  if (fakeTimersType) {
    jest.useFakeTimers(fakeTimersType);
  }

  return callbackReturnValue;
}

function getJestFakeTimersType() {
  // istanbul ignore if
  if (
    typeof jest === 'undefined' ||
    typeof globalObj.setTimeout === 'undefined'
  ) {
    return null;
  }

  if (
    typeof globalObj.setTimeout._isMockFunction !== 'undefined' &&
    globalObj.setTimeout._isMockFunction
  ) {
    return 'legacy';
  }

  if (
    typeof globalObj.setTimeout.clock !== 'undefined' &&
    typeof jest.getRealSystemTime !== 'undefined'
  ) {
    try {
      // jest.getRealSystemTime is only supported for Jest's `modern` fake timers and otherwise throws
      jest.getRealSystemTime();
      return 'modern';
    } catch {
      // not using Jest's modern fake timers
    }
  }
  return null;
}

// we only run our tests in node, and setImmediate is supported in node.
// istanbul ignore next
function setImmediatePolyfill(fn) {
  return globalObj.setTimeout(fn, 0);
}

function getTimeFunctions() {
  // istanbul ignore next
  return {
    clearTimeoutFn: globalObj.clearTimeout,
    setImmediateFn: globalObj.setImmediate || setImmediatePolyfill,
    setTimeoutFn: globalObj.setTimeout,
  };
}

const { clearTimeoutFn, setImmediateFn, setTimeoutFn } = runWithRealTimers(
  getTimeFunctions
);

export {
  clearTimeoutFn as clearTimeout,
  setImmediateFn as setImmediate,
  setTimeoutFn as setTimeout,
};
