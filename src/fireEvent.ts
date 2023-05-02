import { ReactTestInstance } from 'react-test-renderer';
import { TextInput } from 'react-native';
import act from './act';
import { getHostParent, isHostElement } from './helpers/component-tree';
import { filterNodeByType } from './helpers/filterNodeByType';
import { getHostComponentNames } from './helpers/host-component-names';

type EventHandler = (...args: any) => unknown;

const isTextInput = (element?: ReactTestInstance) => {
  if (!element) {
    return false;
  }

  // We have to test if the element type is either the `TextInput` component
  // (for composite component) or the string "TextInput" (for host component)
  // All queries return host components but since fireEvent bubbles up
  // it would trigger the parent prop without the composite component check.
  return (
    filterNodeByType(element, TextInput) ||
    filterNodeByType(element, getHostComponentNames().textInput)
  );
};

const isTouchResponder = (element?: ReactTestInstance) => {
  if (!isHostElement(element)) return false;

  return !!element?.props.onStartShouldSetResponder || isTextInput(element);
};

const isPointerEventEnabled = (
  element: ReactTestInstance,
  isParent?: boolean
): boolean => {
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
};

const isTouchEvent = (eventName?: string) => {
  return eventName === 'press';
};

const isEventEnabled = (
  element: ReactTestInstance,
  touchResponder?: ReactTestInstance,
  eventName?: string
) => {
  if (isTextInput(element)) return element?.props.editable !== false;
  if (!isPointerEventEnabled(element) && isTouchEvent(eventName)) return false;

  const touchStart = touchResponder?.props.onStartShouldSetResponder?.();
  const touchMove = touchResponder?.props.onMoveShouldSetResponder?.();

  if (touchStart || touchMove) return true;

  return touchStart === undefined && touchMove === undefined;
};

const findEventHandler = (
  element: ReactTestInstance,
  eventName: string,
  nearestTouchResponder?: ReactTestInstance
): EventHandler | null => {
  const touchResponder = isTouchResponder(element)
    ? element
    : nearestTouchResponder;

  const handler = getEventHandler(element, eventName);
  if (handler && isEventEnabled(element, touchResponder, eventName))
    return handler;

  if (element.parent === null || element.parent.parent === null) {
    return null;
  }

  return findEventHandler(element.parent, eventName, touchResponder);
};

const getEventHandler = (
  element: ReactTestInstance,
  eventName: string
): EventHandler | undefined => {
  const eventHandlerName = getEventHandlerName(eventName);
  if (typeof element.props[eventHandlerName] === 'function') {
    return element.props[eventHandlerName];
  }

  if (typeof element.props[eventName] === 'function') {
    return element.props[eventName];
  }

  return undefined;
};

const getEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const fireEvent = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
) => {
  const handler = findEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  let returnValue;
  act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
};

fireEvent.press = (element: ReactTestInstance, ...data: Array<any>): void =>
  fireEvent(element, 'press', ...data);

fireEvent.changeText = (
  element: ReactTestInstance,
  ...data: Array<any>
): void => fireEvent(element, 'changeText', ...data);

fireEvent.scroll = (element: ReactTestInstance, ...data: Array<any>): void =>
  fireEvent(element, 'scroll', ...data);

export default fireEvent;
