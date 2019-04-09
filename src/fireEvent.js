// @flow
import act from './act';
import { ErrorWithStack } from './helpers/errors';

const findEventHandler = (element: ReactTestInstance, eventName: string) => {
  const eventHandler = toEventHandlerName(eventName);

  if (typeof element.props[eventHandler] === 'function') {
    return element.props[eventHandler];
  } else if (typeof element.props[eventName] === 'function') {
    return element.props[eventName];
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
): any => {
  const handler = findEventHandler(element, eventName);

  let returnValue;

  act(() => {
    returnValue = handler(data);
  });

  return returnValue;
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'press');
const changeTextHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'changeText', data);
const scrollHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'scroll', data);

const fireEvent = invokeEvent;

fireEvent.press = pressHandler;
fireEvent.changeText = changeTextHandler;
fireEvent.scroll = scrollHandler;

export default fireEvent;
