// @flow
import act from './act';
import { ErrorWithStack } from './helpers/errors';

const isHostElement = (element?: ReactTestInstance) => {
  return typeof element?.type === 'string';
};

const isTextInput = (element?: ReactTestInstance) => {
  const { TextInput } = require('react-native');
  return element?.type === TextInput;
};

const isTouchResponder = (element?: ReactTestInstance) => {
  if (!isHostElement(element)) return false;

  return !!element?.props.onStartShouldSetResponder || isTextInput(element);
};

const isPointerEventEnabled = (
  element?: ReactTestInstance,
  isParent?: boolean
) => {
  const parentCondition = isParent
    ? element?.props.pointerEvents === 'box-only'
    : element?.props.pointerEvents === 'box-none';

  if (element?.props.pointerEvents === 'none' || parentCondition) {
    return false;
  }

  if (!element?.parent) return true;

  return isPointerEventEnabled(element.parent, true);
};

const isEventEnabled = (
  element?: ReactTestInstance,
  touchResponder?: ReactTestInstance
) => {
  if (isTextInput(element)) return element?.props.editable !== false;
  if (!isPointerEventEnabled(element)) return false;

  const touchStart = touchResponder?.props.onStartShouldSetResponder?.();
  const touchMove = touchResponder?.props.onMoveShouldSetResponder?.();

  if (touchStart || touchMove) return true;

  return touchStart === undefined && touchMove === undefined;
};

const findEventHandler = (
  element: ReactTestInstance,
  eventName: string,
  callsite?: any,
  nearestTouchResponder?: ReactTestInstance,
  hasDescendandHandler?: boolean
) => {
  const touchResponder = isTouchResponder(element)
    ? element
    : nearestTouchResponder;

  const handler = getEventHandler(element, eventName);
  if (handler && isEventEnabled(element, touchResponder)) return handler;

  // Do not bubble event to the root element
  const hasHandler = handler != null || hasDescendandHandler;
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
    touchResponder,
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
    return;
  }

  let returnValue;

  act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance): void =>
  invokeEvent(element, 'press', pressHandler);
const changeTextHandler = (
  element: ReactTestInstance,
  ...data: Array<any>
): void => invokeEvent(element, 'changeText', changeTextHandler, ...data);
const scrollHandler = (element: ReactTestInstance, ...data: Array<any>): void =>
  invokeEvent(element, 'scroll', scrollHandler, ...data);

const fireEvent = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
): void => invokeEvent(element, eventName, fireEvent, ...data);

fireEvent.press = pressHandler;
fireEvent.changeText = changeTextHandler;
fireEvent.scroll = scrollHandler;

export default fireEvent;
