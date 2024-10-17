import { HostElement } from '../../renderer/host-element';
import act from '../../act';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 */
export function dispatchEvent(element: HostElement, eventName: string, ...event: unknown[]) {
  const handler = getEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  // This will be called synchronously.
  void act(() => {
    handler(...event);
  });
}

function getEventHandler(element: HostElement, eventName: string) {
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
