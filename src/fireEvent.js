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
  data?: *
) => {
  const handler = findEventHandler(element, eventName);

  return handler(data);
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'press');
const doublePressHandler = (element: ReactTestInstance) =>
  invokeEvent(element, 'doublePress');
const changeTextHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'changeText', data);
const scrollHandler = (element: ReactTestInstance, data?: *) =>
  invokeEvent(element, 'scroll', data);

const EVENTS = [
  {
    name: 'press',
    handler: pressHandler,
  },
  {
    name: 'doublePress',
    handler: doublePressHandler,
  },
  {
    name: 'changeText',
    handler: changeTextHandler,
  },
  {
    name: 'scroll',
    handler: scrollHandler,
  },
];

const fireEvent = invokeEvent;

EVENTS.forEach(event => {
  fireEvent[event.name] = event.handler;
});

export default fireEvent;
