// This file and the act() implementation is sourced from react-testing-library
// https://github.com/testing-library/react-testing-library/blob/c80809a956b0b9f3289c4a6fa8b5e8cc72d6ef6d/src/act-compat.js
import { act as reactTestRendererAct } from 'react-test-renderer';
import { checkReactVersionAtLeast } from './react-versions';

type ReactAct = typeof reactTestRendererAct;

// See https://github.com/reactwg/react-18/discussions/102 for more context on global.IS_REACT_ACT_ENVIRONMENT
declare global {
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

    // this code is riddled with eslint disabling comments because this doesn't use real promises but eslint thinks we do
    try {
      // The return value of `act` is always a thenable.
      let callbackNeedsToBeAwaited = false;
      const actResult = actImplementation(() => {
        const result = callback();
        if (
          result !== null &&
          typeof result === 'object' &&
          // @ts-expect-error this should be a promise or thenable
          // eslint-disable-next-line promise/prefer-await-to-then
          typeof result.then === 'function'
        ) {
          callbackNeedsToBeAwaited = true;
        }
        return result;
      });

      if (callbackNeedsToBeAwaited) {
        const thenable = actResult;
        return {
          then: (
            resolve: (value: never) => never,
            reject: (value: never) => never
          ) => {
            // eslint-disable-next-line
            thenable.then(
              // eslint-disable-next-line promise/always-return
              (returnValue) => {
                setIsReactActEnvironment(previousActEnvironment);
                resolve(returnValue);
              },
              (error) => {
                setIsReactActEnvironment(previousActEnvironment);
                reject(error);
              }
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

const act: ReactAct = checkReactVersionAtLeast(18, 0)
  ? (withGlobalActEnvironment(reactTestRendererAct) as ReactAct)
  : reactTestRendererAct;

export default act;
export {
  setIsReactActEnvironment as setReactActEnvironment,
  getIsReactActEnvironment,
};
