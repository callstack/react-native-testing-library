import { ReactTestInstance } from 'react-test-renderer';
import { TextInput } from 'react-native';
import act from './act';
import { getHostParent, isHostElement } from './helpers/component-tree';
import { filterNodeByType } from './helpers/filterNodeByType';
import { getHostComponentNames } from './helpers/host-component-names';

type EventHandler = (...args: unknown[]) => unknown;

function isTextInput(element: ReactTestInstance) {
  // We have to test if the element type is either the `TextInput` component
  // (for composite component) or the string "TextInput" (for host component)
  // All queries return host components but since fireEvent bubbles up
  // it would trigger the parent prop without the composite component check.
  return (
    filterNodeByType(element, TextInput) ||
    filterNodeByType(element, getHostComponentNames().textInput)
  );
}

function isTouchResponder(element: ReactTestInstance) {
  if (!isHostElement(element)) {
    return false;
  }

  return (
    Boolean(element.props.onStartShouldSetResponder) || isTextInput(element)
  );
}

function isPointerEventEnabled(
  element: ReactTestInstance,
  isParent?: boolean
): boolean {
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
}

// Due to accepting both `press` and `onPress` for event names, we need to
// cover both forms.
const touchEventNames = ['press', 'onPress'];

function isTouchEvent(eventName: string) {
  return touchEventNames.includes(eventName);
}

function isEventEnabled(
  element: ReactTestInstance,
  eventName: string,
  nearestTouchResponder?: ReactTestInstance
) {
  if (isTextInput(element)) {
    return element.props.editable !== false;
  }

  if (isTouchEvent(eventName) && !isPointerEventEnabled(element)) {
    return false;
  }

  const touchStart = nearestTouchResponder?.props.onStartShouldSetResponder?.();
  const touchMove = nearestTouchResponder?.props.onMoveShouldSetResponder?.();
  if (touchStart || touchMove) {
    return true;
  }

  return touchStart === undefined && touchMove === undefined;
}

function findEventHandler(
  element: ReactTestInstance,
  eventName: string,
  nearestTouchResponder?: ReactTestInstance
): EventHandler | null {
  const touchResponder = isTouchResponder(element)
    ? element
    : nearestTouchResponder;

  const handler = getEventHandler(element, eventName);
  if (handler && isEventEnabled(element, eventName, touchResponder))
    return handler;

  if (element.parent === null || element.parent.parent === null) {
    return null;
  }

  return findEventHandler(element.parent, eventName, touchResponder);
}

function getEventHandler(element: ReactTestInstance, eventName: string) {
  const eventHandlerName = getEventHandlerName(eventName);
  if (typeof element.props[eventHandlerName] === 'function') {
    return element.props[eventHandlerName];
  }

  if (typeof element.props[eventName] === 'function') {
    return element.props[eventName];
  }

  return undefined;
}

function getEventHandlerName(eventName: string) {
  return `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;
}

function fireEvent(
  element: ReactTestInstance,
  eventName: string,
  ...data: unknown[]
) {
  const handler = findEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  let returnValue;
  act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
}

fireEvent.press = (element: ReactTestInstance, ...data: unknown[]) =>
  fireEvent(element, 'press', ...data);

fireEvent.changeText = (element: ReactTestInstance, ...data: unknown[]) =>
  fireEvent(element, 'changeText', ...data);

fireEvent.scroll = (element: ReactTestInstance, ...data: unknown[]) =>
  fireEvent(element, 'scroll', ...data);

export default fireEvent;
