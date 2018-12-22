// @flow
import { ErrorWithStack } from './helpers/errors';

const findEventHandler = (element: ReactTestInstance, eventName: string) => {
  const eventHandler = toEventHandlerName(eventName);

  if (typeof element.props[eventHandler] === 'function') {
    return element.props[eventHandler];
  }

  // Do not bubble event to the root element
  if (element.parent === null || element.parent.parent === null) {
    throw new ErrorWithStack(
      `No handler function found for event: ${eventName}`,
      invokeEvent
    );
  }

  return findEventHandler(element.parent, eventName);
};

const invokeEvent = (
  element: ReactTestInstance,
  eventName: string,
  data?: *
) => {
  const handler = findEventHandler(element, eventName);

  return handler(data);
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'press');
const blurHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'blur');
const changeTextHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'changeText', data);
const scrollHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'scroll', data);

const fireEvent = invokeEvent;

fireEvent.press = pressHandler;
fireEvent.blur = blurHandler;
fireEvent.changeText = changeTextHandler;
fireEvent.scroll = scrollHandler;

export default fireEvent;
