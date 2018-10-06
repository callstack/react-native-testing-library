// @flow
import * as React from 'react';

const findEventHandler = (element: ReactTestInstance, eventName: string) => {
  if (typeof element.props[`on${eventName}`] === 'function') {
    return element.props[`on${eventName}`];
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
  const handler = findEventHandler(element, capitalize(eventName));

  return handler(data);
};

const capitalize = (name: string) =>
  name.charAt(0).toUpperCase() + name.slice(1);

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
