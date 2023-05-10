import { ReactTestInstance } from 'react-test-renderer';
import act from '../../act';
import { isEventEnabled, isTouchResponder } from '../../fireEvent';

type EventHandler = (event: unknown) => void;

/**
 * Dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload
 */
export function dispatchHostEvent(
  element: ReactTestInstance,
  eventName: string,
  event: unknown
) {
  const handler = getEnabledEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  act(() => {
    handler(event);
  });
}

function getEnabledEventHandler(
  element: ReactTestInstance,
  eventName: string
): EventHandler | null {
  const touchResponder = isTouchResponder(element) ? element : undefined;

  const handler = getEventHandler(element, eventName);
  if (handler && isEventEnabled(element, eventName, touchResponder)) {
    return handler;
  }

  return null;
}

function getEventHandler(element: ReactTestInstance, eventName: string) {
  const eventHandlerName = getEventHandlerName(eventName);
  if (typeof element.props[eventHandlerName] === 'function') {
    return element.props[eventHandlerName];
  }

  return undefined;
}

function getEventHandlerName(eventName: string) {
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
}
