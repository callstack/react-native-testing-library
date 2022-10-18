// Most content of this file sourced directly from https://github.com/testing-library/dom-testing-library/blob/main/src/helpers.js
/* globals jest */
const globalObj = typeof window === 'undefined' ? global : window;

type FakeTimersTypes = 'modern' | 'legacy';

// Currently this fn only supports jest timers, but it could support other test runners in the future.
function runWithRealTimers<T>(callback: () => T): T {
  const fakeTimersType = getJestFakeTimersType();
  if (fakeTimersType) {
    jest.useRealTimers();
  }

  const callbackReturnValue = callback();

  if (fakeTimersType) {
    const fakeTimersConfig = getFakeTimersConfigFromType(fakeTimersType);
    jest.useFakeTimers(fakeTimersConfig);
  }

  return callbackReturnValue;
}

function getJestFakeTimersType(): FakeTimersTypes | null {
  // istanbul ignore if
  if (
    typeof jest === 'undefined' ||
    typeof globalObj.setTimeout === 'undefined' ||
    process.env.RNTL_SKIP_AUTO_DETECT_FAKE_TIMERS
  ) {
    return null;
  }

  if (
    // @ts-expect-error jest mutates setTimeout
    typeof globalObj.setTimeout._isMockFunction !== 'undefined' &&
    // @ts-expect-error jest mutates setTimeout
    globalObj.setTimeout._isMockFunction
  ) {
    return 'legacy';
  }

  if (
    // @ts-expect-error jest mutates setTimeout
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

function getFakeTimersConfigFromType(type: FakeTimersTypes) {
  return type === 'legacy'
    ? { legacyFakeTimers: true }
    : { legacyFakeTimers: false };
}

const jestFakeTimersAreEnabled = (): boolean =>
  Boolean(getJestFakeTimersType());

// we only run our tests in node, and setImmediate is supported in node.
function setImmediatePolyfill(fn: Function) {
  return globalObj.setTimeout(fn, 0);
}

type BindTimeFunctions = {
  clearTimeoutFn: typeof clearTimeout;
  setImmediateFn: typeof setImmediate;
  setTimeoutFn: typeof setTimeout;
};

function bindTimeFunctions(): BindTimeFunctions {
  return {
    clearTimeoutFn: globalObj.clearTimeout,
    setImmediateFn: globalObj.setImmediate || setImmediatePolyfill,
    setTimeoutFn: globalObj.setTimeout,
  };
}

const { clearTimeoutFn, setImmediateFn, setTimeoutFn } = runWithRealTimers(
  bindTimeFunctions
) as BindTimeFunctions;

export {
  runWithRealTimers,
  jestFakeTimersAreEnabled,
  clearTimeoutFn as clearTimeout,
  setImmediateFn as setImmediate,
  setTimeoutFn as setTimeout,
};
