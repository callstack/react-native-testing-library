import { act as reactTestRendererAct } from 'react-test-renderer';
import { checkReactVersionAtLeast } from './checkReactVersionAtLeast';

const actMock = (callback: () => void) => {
  callback();
};

type GlobalWithReactActEnvironment = {
  IS_REACT_ACT_ENVIRONMENT?: boolean;
} & typeof globalThis;
function getGlobalThis(): GlobalWithReactActEnvironment {
  // eslint-disable-next-line no-restricted-globals
  if (typeof self !== 'undefined') {
    // eslint-disable-next-line no-restricted-globals
    return self as GlobalWithReactActEnvironment;
  }
  if (typeof window !== 'undefined') {
    return window;
  }
  if (typeof global !== 'undefined') {
    return global;
  }

  throw new Error('unable to locate global object');
}

function setIsReactActEnvironment(isReactActEnvironment: boolean | undefined) {
  getGlobalThis().IS_REACT_ACT_ENVIRONMENT = isReactActEnvironment;
}

function getIsReactActEnvironment() {
  return getGlobalThis().IS_REACT_ACT_ENVIRONMENT;
}

type Act = typeof reactTestRendererAct;
function withGlobalActEnvironment(actImplementation: Act) {
  return (callback: Parameters<Act>[0]) => {
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
          // eslint-disable-next-line promise/prefer-await-to-then
          typeof (result as any).then === 'function'
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

const act = reactTestRendererAct
  ? checkReactVersionAtLeast(18, 0)
    ? withGlobalActEnvironment(reactTestRendererAct)
    : reactTestRendererAct
  : actMock;

export default act;
export {
  setIsReactActEnvironment as setReactActEnvironment,
  getIsReactActEnvironment,
};
