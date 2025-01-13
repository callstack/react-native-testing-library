import type { ReactTestInstance } from 'react-test-renderer';
import act from '../../act';
import { isElementMounted } from '../../helpers/component-tree';
import { formatElement } from '../../helpers/format-element';
import { logger } from '../../helpers/logger';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 */
export function dispatchEvent(element: ReactTestInstance, eventName: string, ...event: unknown[]) {
  if (!isElementMounted(element)) {
    return;
  }

  const handler = getEventHandler(element, eventName);
  if (!handler) {
    logger.debug(
      `User Event: no event handler for "${eventName}" found on ${formatElement(element, {
        minimal: true,
      })}`,
    );
    return;
  }

  // This will be called synchronously.
  void act(() => {
    handler(...event);
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
