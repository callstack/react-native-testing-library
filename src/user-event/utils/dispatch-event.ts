import { ReactTestInstance } from 'react-test-renderer';
import act from '../../act';
import { getHostParent } from '../../helpers/component-tree';
import { isHostTextInput } from '../../helpers/host-component-names';

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
  const handler = findEnabledEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  act(() => {
    handler(event);
  });
}

/**
 * Dispatch event function only to given element. Does not look event handler
 * in the ancestors.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload
 */
export function dispatchOwnHostEvent(
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

/**
 * Looks up for event handler in the element and its ancestors.
 */
function findEnabledEventHandler(
  element: ReactTestInstance,
  eventName: string
): EventHandler | null {
  let current: ReactTestInstance | null = element;
  while (current != null) {
    const handler = getEventHandler(current, eventName);
    if (handler) {
      return handler;
    }

    current = getHostParent(current);
  }

  return null;
}

function getEventHandler(element: ReactTestInstance, eventName: string) {
  const eventHandlerName = getEventHandlerName(eventName);
  if (typeof element.props[eventHandlerName] !== 'function') {
    return null;
  }

  if (!isEventEnabled(element)) {
    return null;
  }

  return element.props[eventHandlerName];
}

function getEventHandlerName(eventName: string) {
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
}

function isEventEnabled(element: ReactTestInstance) {
  if (isHostTextInput(element)) {
    return element?.props.editable !== false;
  }

  if (!isPointerEventEnabled(element)) {
    return false;
  }

  const touchStart = element?.props.onStartShouldSetResponder?.();
  return touchStart !== false;
}

export function isPointerEventEnabled(
  element: ReactTestInstance,
  isParent?: boolean
): boolean {
  const pointerEvents = element.props.pointerEvents;
  if (pointerEvents === 'none') {
    return false;
  }

  if (isParent ? pointerEvents === 'box-only' : pointerEvents === 'box-none') {
    return false;
  }

  const parent = getHostParent(element);
  if (!parent) {
    return true;
  }

  return isPointerEventEnabled(parent, true);
}
