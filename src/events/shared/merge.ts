import { isObject } from '../../helpers/object';
import type { EventProps } from './types';

/**
 * Deep merges custom props into a built event, so tests can override only the fields they need.
 * Nested objects are merged, other values (including arrays) are replaced. Mutates and returns
 * the passed event.
 */
export function mergeEventProps<T extends object>(event: T, eventProps?: EventProps): T {
  if (eventProps) {
    mergeInto(event as EventProps, eventProps);
  }

  return event;
}

function mergeInto(target: EventProps, source: EventProps) {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (isObject(sourceValue) && isObject(targetValue)) {
      mergeInto(targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }
}
