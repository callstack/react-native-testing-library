// @flow
import act from './act';
import { ErrorWithStack } from './helpers/errors';

const findEventHandler = (
  element: ReactTestInstance,
  eventName: string,
  callsite?: any
) => {
  const eventHandler = toEventHandlerName(eventName);

  if (typeof element.props[eventHandler] === 'function') {
    return element.props[eventHandler];
  } else if (typeof element.props[eventName] === 'function') {
    return element.props[eventName];
  }

  // Do not bubble event to the root element
  if (element.parent === null || element.parent.parent === null) {
    throw new ErrorWithStack(
      `No handler function found for event: "${eventName}"`,
      callsite || invokeEvent
    );
  }

  return findEventHandler(element.parent, eventName, callsite);
};

const invokeEvent = (
  element: ReactTestInstance,
  eventName: string,
  data?: any,
  callsite?: any
) => {
  const handler = findEventHandler(element, eventName, callsite);

  if (!handler) {
    return null;
  }

  let returnValue;

  act(() => {
    returnValue = handler(data);
  });

  return returnValue;
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'press', undefined, pressHandler);
const changeTextHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'changeText', data, changeTextHandler);
const scrollHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'scroll', data, scrollHandler);

const fireEvent = invokeEvent;

fireEvent.press = pressHandler;
fireEvent.changeText = changeTextHandler;
fireEvent.scroll = scrollHandler;

export default fireEvent;
