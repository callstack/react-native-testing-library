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
  return (
    getHandlerByName(props, getEventHandlerName(eventType)) ??
    (options?.loose ? getHandlerByName(props, eventType) : undefined)
  );
}

/**
 * Returns the handler prop with exactly the given name (e.g. `onFocusCapture`), or else its
 * `testOnly_` variant (`testOnly_onFocusCapture`), which lets tests handle events on host elements.
 */
export function getHandlerByName(
  props: Record<string, unknown>,
  handlerName: string,
): EventHandler | undefined {
  return getHandlerProp(props, handlerName) ?? getHandlerProp(props, `testOnly_${handlerName}`);
}

function getHandlerProp(
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
