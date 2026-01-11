import type { BaseSyntheticEvent } from 'react';

/** Builds base syntentic event stub, with prop values as inspected in RN runtime. */
type BaseEvent = Partial<BaseSyntheticEvent<object, unknown, unknown>> & {
  // `isPersistent` is not a standard prop, but it's used in RN runtime. See: https://react.dev/reference/react-dom/components/common#react-event-object-methods
  isPersistent: () => boolean;
};

export function baseSyntheticEvent(): BaseEvent {
  return {
    currentTarget: {},
    target: {},
    preventDefault: () => {},
    isDefaultPrevented: () => false,
    stopPropagation: () => {},
    isPropagationStopped: () => false,
    persist: () => {},
    isPersistent: () => false,
    timeStamp: 0,
  };
}
