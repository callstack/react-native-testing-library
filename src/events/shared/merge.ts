import { isObject } from '../../helpers/object';
import type { EventProps } from './types';

/**
 * Deep merges custom props into a built event, so tests can override only the fields they need.
 * Props are merged in order, so later ones win. Nested objects are merged, other values (including
 * arrays) are replaced. Mutates and returns the passed event.
 */
export function mergeEventProps<T extends object>(
  event: T,
  ...eventProps: Array<EventProps | undefined>
): T {
  for (const props of eventProps) {
    if (props) {
      mergeInto(event as EventProps, props);
    }
  }

  return event;
}

function mergeInto(target: EventProps, source: EventProps) {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    // Only recurse into the target's own objects, so a `__proto__` key can't reach `Object.prototype`.
    if (Object.hasOwn(target, key) && isObject(sourceValue) && isObject(targetValue)) {
      mergeInto(targetValue, sourceValue);
    } else {
      target[key] = sourceValue;
    }
  }
}
