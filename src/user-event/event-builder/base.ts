import { BaseSyntheticEvent } from 'react';

/** Builds base syntentic event stub, with prop values as inspected in RN runtime. */
export function baseSyntheticEvent(): Partial<BaseSyntheticEvent<{}, unknown, unknown>> {
  return {
    currentTarget: {},
    target: {},
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    persist: () => {},
    timeStamp: 0,
  };
}
