import type { EventHandler } from './types';

export type EventHandlerOptions = {
  /** Include check for event handler named without adding `on*` prefix. */
  loose?: boolean;
};

export function getEventHandlerFromProps(
  props: Record<string, unknown>,
  eventType: string,
  options?: EventHandlerOptions,
): EventHandler | undefined {
  const handlerName = getEventHandlerName(eventType);
  if (typeof props[handlerName] === 'function') {
    return props[handlerName] as EventHandler;
  }

  if (options?.loose && typeof props[eventType] === 'function') {
    return props[eventType] as EventHandler;
  }

  if (typeof props[`testOnly_${handlerName}`] === 'function') {
    return props[`testOnly_${handlerName}`] as EventHandler;
  }

  if (options?.loose && typeof props[`testOnly_${eventType}`] === 'function') {
    return props[`testOnly_${eventType}`] as EventHandler;
  }

  return undefined;
}

/**
 * Returns the event type without the `on*` prefix, e.g. `onLayout` -> `layout`.
 * Note: `fireEvent` accepts event types with and without the prefix, so use this
 * before comparing event types.
 */
export function normalizeEventType(eventType: string) {
  if (hasOnPrefix(eventType)) {
    return eventType.charAt(2).toLowerCase() + eventType.slice(3);
  }

  return eventType;
}

export function getEventHandlerName(eventType: string) {
  if (hasOnPrefix(eventType)) {
    return eventType;
  }

  return `on${capitalizeFirstLetter(eventType)}`;
}

function hasOnPrefix(eventType: string) {
  return /^on[A-Z]/.test(eventType);
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
