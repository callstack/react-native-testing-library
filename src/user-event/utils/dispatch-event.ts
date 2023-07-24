import { ReactTestInstance } from 'react-test-renderer';
import act from '../../act';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload
 */
export function dispatchEvent(
  element: ReactTestInstance,
  eventName: string,
  event: unknown
) {
  const handler = getEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  act(() => {
    handler(event);
  });
}

function getEventHandler(element: ReactTestInstance, eventName: string) {
  const handleName = getEventHandlerName(eventName);
  const handle = element.props[handleName] as unknown;
  if (typeof handle !== 'function') {
    return undefined;
  }

  return handle;
}

function getEventHandlerName(eventName: string) {
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
}
