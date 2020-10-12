// @flow
import act from './act';
import { ErrorWithStack } from './helpers/errors';

const isTextInputComponent = (element: ReactTestInstance) => {
  // eslint-disable-next-line import/no-extraneous-dependencies
  const { TextInput } = require('react-native');
  return element.type === TextInput;
};

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
  const hostElement = isHostComponent
    ? element
    : nearestHostDescendent;

  const isEventEnabled = isTextInputComponent(element)
    ? element.props.editable !== false
    : hostElement?.props.onStartShouldSetResponder?.() !== false;

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

  // Check if the host element can receive touch events. Either it is a
  // TextInput component or has a onStartShouldSetResponder prop
  const isHostElementATouchResponder = hostElement
  ? (isTextInputComponent(hostElement) ||
    !!hostElement?.props.onStartShouldSetResponder)
  : false;

  // If the host element is a receiver of touch events than it is the new
  // nearest host descendant. Otherwise, pass the previously received nearest
  // host descendant (or current element if a nearest host descendent is falsy)
  const targetDescendent = isHostElementATouchResponder
    ? hostElement
    : (nearestHostDescendent || element)

  return findEventHandler(
    element.parent,
    eventName,
    callsite,
    targetDescendent,
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
