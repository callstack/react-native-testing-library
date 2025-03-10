// This file and the act() implementation is sourced from react-testing-library
// https://github.com/testing-library/react-testing-library/blob/3dcd8a9649e25054c0e650d95fca2317b7008576/types/index.d.ts
import * as React from 'react';

type ReactAct = typeof React.act;

// See https://github.com/reactwg/react-18/discussions/102 for more context on global.IS_REACT_ACT_ENVIRONMENT
declare global {
  // eslint-disable-next-line no-var
  var IS_REACT_ACT_ENVIRONMENT: boolean | undefined;
}

function setIsReactActEnvironment(isReactActEnvironment: boolean | undefined) {
  globalThis.IS_REACT_ACT_ENVIRONMENT = isReactActEnvironment;
}

function getIsReactActEnvironment() {
  return globalThis.IS_REACT_ACT_ENVIRONMENT;
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
        // @ts-expect-error TS is too strict here
        if (result !== null && typeof result === 'object' && typeof result.then === 'function') {
          callbackNeedsToBeAwaited = true;
        }
        return result;
      });

      if (callbackNeedsToBeAwaited) {
        const thenable = actResult;
        return {
          then: (resolve: (value: never) => never, reject: (value: never) => never) => {
            // eslint-disable-next-line promise/catch-or-return, promise/prefer-await-to-then
            thenable.then(
              // eslint-disable-next-line promise/always-return
              (returnValue) => {
                setIsReactActEnvironment(previousActEnvironment);
                // @ts-expect-error too strict typing
                resolve(returnValue);
              },
              (error) => {
                setIsReactActEnvironment(previousActEnvironment);
                // @ts-expect-error too strict typing
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

const act = withGlobalActEnvironment(React.act);

export default act;
export { setIsReactActEnvironment as setReactActEnvironment, getIsReactActEnvironment };
