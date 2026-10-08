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
  return (
    getHandlerProp(props, handlerName) ??
    (options?.loose ? getHandlerProp(props, eventType) : undefined) ??
    getHandlerProp(props, `testOnly_${handlerName}`) ??
    (options?.loose ? getHandlerProp(props, `testOnly_${eventType}`) : undefined)
  );
}

/**
 * Returns the prop with exactly the given name (e.g. `onFocusCapture`) if it is a function.
 */
export function getHandlerProp(
  props: Record<string, unknown>,
  propName: string,
): EventHandler | undefined {
  const handler = props[propName];
  return typeof handler === 'function' ? (handler as EventHandler) : undefined;
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
