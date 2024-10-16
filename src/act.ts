import * as React from 'react';
// This file and the act() implementation is sourced from react-testing-library
// https://github.com/testing-library/react-testing-library/blob/c80809a956b0b9f3289c4a6fa8b5e8cc72d6ef6d/src/act-compat.js

type ReactAct = typeof React.act;

const reactAct = React.act;

function getGlobalThis() {
  /* istanbul ignore else */
  if (typeof globalThis !== 'undefined') {
    return globalThis;
  }
  /* istanbul ignore next */
  if (typeof self !== 'undefined') {
    return self;
  }
  /* istanbul ignore next */
  if (typeof window !== 'undefined') {
    return window;
  }
  /* istanbul ignore next */
  if (typeof global !== 'undefined') {
    return global;
  }
  /* istanbul ignore next */
  throw new Error('unable to locate global object');
}

// See https://github.com/reactwg/react-18/discussions/102 for more context on global.IS_REACT_ACT_ENVIRONMENT
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

function setIsReactActEnvironment(isReactActEnvironment: boolean | undefined) {
  getGlobalThis().IS_REACT_ACT_ENVIRONMENT = isReactActEnvironment;
}

function getIsReactActEnvironment() {
  return getGlobalThis().IS_REACT_ACT_ENVIRONMENT;
}

function withGlobalActEnvironment(actImplementation: ReactAct) {
  return (callback: Parameters<ReactAct>[0]) => {
    const previousActEnvironment = getIsReactActEnvironment();
    setIsReactActEnvironment(true);
    try {
      // The return value of `act` is always a thenable.
      let callbackNeedsToBeAwaited = false;
      const actResult = actImplementation(() => {
        const result = callback();
        // @ts-expect-error result is not typed
        if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
          callbackNeedsToBeAwaited = true;
        }
        return result;
      });

      if (callbackNeedsToBeAwaited) {
        const thenable = actResult;
        return {
          then: (resolve: (value: unknown) => void, reject: (error: unknown) => void) => {
            // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
            thenable.then(
              // eslint-disable-next-line promise/always-return
              (returnValue) => {
                setIsReactActEnvironment(previousActEnvironment);
                resolve(returnValue);
              },
              (error) => {
                setIsReactActEnvironment(previousActEnvironment);
                reject(error);
              },
            );
          },
        };
      } else {
        setIsReactActEnvironment(previousActEnvironment);
        return actResult;
      }
    } catch (error) {
      // Can't be a `finally {}` block since we don't know if we have to immediately restore IS_REACT_ACT_ENVIRONMENT
      // or if we have to await the callback first.
      setIsReactActEnvironment(previousActEnvironment);
      throw error;
    }
  };
}

const act: ReactAct = withGlobalActEnvironment(reactAct) as ReactAct;

export default act;
export { setIsReactActEnvironment as setReactActEnvironment, getIsReactActEnvironment };
