import type { BaseSyntheticEvent } from 'react';

/** Builds base syntentic event stub, with prop values as inspected in RN runtime. */
export function baseSyntheticEvent(): Partial<BaseSyntheticEvent<object, unknown, unknown>> {
  return {
    currentTarget: {},
    target: {},
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    persist: () => {},
    // @ts-expect-error: `isPersistent` is not a standard prop, but it's used in RN runtime. See: https://react.dev/reference/react-dom/components/common#react-event-object-methods
    isPersistent: () => false,
    timeStamp: 0,
  };
}
