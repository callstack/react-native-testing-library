import { HostElement } from "universal-test-renderer";

export type EventHandlerOptions = {
  /** Include check for event handler named without adding `on*` prefix. */
  loose?: boolean;
};

export function getEventHandler(
  element: HostElement,
  eventName: string,
  options?: EventHandlerOptions,
) {
  const handlerName = getEventHandlerName(eventName);
  if (typeof element.props[handlerName] === 'function') {
    return element.props[handlerName];
  }

  if (options?.loose && typeof element.props[eventName] === 'function') {
    return element.props[eventName];
  }

  if (typeof element.props[`testOnly_${handlerName}`] === 'function') {
    return element.props[`testOnly_${handlerName}`];
  }

  if (options?.loose && typeof element.props[`testOnly_${eventName}`] === 'function') {
    return element.props[`testOnly_${eventName}`];
  }

  return undefined;
}

export function getEventHandlerName(eventName: string) {
  return `on${capitalizeFirstLetter(eventName)}`;
}

function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
