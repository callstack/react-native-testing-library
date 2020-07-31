// @flow
import act from './act';
import { ErrorWithStack } from './helpers/errors';

const findEventHandler = (
  element: ReactTestInstance,
  eventName: string,
  callsite?: any,
  nearestHostDescendent?: ReactTestInstance,
  hasDescendandHandler?: boolean
) => {
  const handler = getEventHandler(element, eventName);
  const hasHandler = handler != null || hasDescendandHandler;

  const isHostComponent = typeof element.type === 'string';
  const hostElement = isHostComponent ? element : nearestHostDescendent;
  const isEventEnabled =
    hostElement?.props.onStartShouldSetResponder?.() !== false;
  if (handler && isEventEnabled) return handler;

  // Do not bubble event to the root element
  if (element.parent === null || element.parent.parent === null) {
    if (hasHandler) {
      return null;
    } else {
      throw new ErrorWithStack(
        `No handler function found for event: "${eventName}"`,
        callsite || invokeEvent
      );
    }
  }

  return findEventHandler(
    element.parent,
    eventName,
    callsite,
    hostElement,
    hasHandler
  );
};

const getEventHandler = (element: ReactTestInstance, eventName: string) => {
  const eventHandlerName = toEventHandlerName(eventName);
  if (typeof element.props[eventHandlerName] === 'function') {
    return element.props[eventHandlerName];
  }

  if (typeof element.props[eventName] === 'function') {
    return element.props[eventName];
  }

  return undefined;
};

const invokeEvent = (
  element: ReactTestInstance,
  eventName: string,
  callsite?: any,
  ...data: Array<any>
) => {
  const handler = findEventHandler(element, eventName, callsite);

  if (!handler) {
    return null;
  }

  let returnValue;

  act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'press', pressHandler);
const changeTextHandler = (element: ReactTestInstance, ...data: Array<any>) =>
  invokeEvent(element, 'changeText', changeTextHandler, ...data);
const scrollHandler = (element: ReactTestInstance, ...data: Array<any>) =>
  invokeEvent(element, 'scroll', scrollHandler, ...data);

const fireEvent = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
) => invokeEvent(element, eventName, fireEvent, ...data);

fireEvent.press = pressHandler;
fireEvent.changeText = changeTextHandler;
fireEvent.scroll = scrollHandler;

export default fireEvent;
