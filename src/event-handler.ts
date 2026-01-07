export type EventHandler = (...args: unknown[]) => unknown;

export type EventHandlerOptions = {
  /** Include check for event handler named without adding `on*` prefix. */
  loose?: boolean;
};

export function getEventHandlerFromProps(
  props: Record<string, unknown>,
  eventName: string,
  options?: EventHandlerOptions,
): EventHandler | undefined {
  const handlerName = getEventHandlerName(eventName);
  if (typeof props[handlerName] === 'function') {
    return props[handlerName] as EventHandler;
  }

  if (options?.loose && typeof props[eventName] === 'function') {
    return props[eventName] as EventHandler;
  }

  if (typeof props[`testOnly_${handlerName}`] === 'function') {
    return props[`testOnly_${handlerName}`] as EventHandler;
  }

  if (options?.loose && typeof props[`testOnly_${eventName}`] === 'function') {
    return props[`testOnly_${eventName}`] as EventHandler;
  }

  return undefined;
}

export function getEventHandlerName(eventName: string) {
  return `on${capitalizeFirstLetter(eventName)}`;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
