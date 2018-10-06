// @flow
const findEventHandler = (element: ReactTestInstance, eventName: string) => {
  const eventHandler = toEventHandlerName(eventName);

  if (typeof element.props[eventHandler] === 'function') {
    return element.props[eventHandler];
  }

  if (element.parent === null) {
    throw new Error(`No handler function found for event: ${eventName}`);
  }

  return findEventHandler(element.parent, eventName);
};

const invokeEvent = (
  element: ReactTestInstance,
  eventName: string,
  data: any
) => {
  const handler = findEventHandler(element, eventName);

  return handler(data);
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const press = (element: ReactTestInstance) => invokeEvent(element, 'press');
const doublePress = (element: ReactTestInstance) =>
  invokeEvent(element, 'doublePress');
const changeText = (element: ReactTestInstance, data: any) =>
  invokeEvent(element, 'changeText', data);
const scroll = (element: ReactTestInstance, data: any) =>
  invokeEvent(element, 'scroll', data);

export default {
  press,
  doublePress,
  changeText,
  scroll,
  invokeEvent,
};
