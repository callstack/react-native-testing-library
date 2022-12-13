import { ReactTestInstance } from 'react-test-renderer';
import { TextInput } from 'react-native';
import act from './act';
import { isHostElement } from './helpers/component-tree';
import { filterNodeByType } from './helpers/filterNodeByType';

type EventHandler = (...args: any) => unknown;

const isTextInput = (element?: ReactTestInstance) => {
  if (!element) {
    return false;
  }

  // We have to test if the element type is either the TextInput component
  // (which would if it is a composite component) or the string
  // TextInput (which would be true if it is a host component)
  // All queries but the one by testID return composite component and event
  // if all queries returned host components, since fireEvent bubbles up
  // it would trigger the parent prop without the composite component check
  return (
    filterNodeByType(element, TextInput) ||
    filterNodeByType(element, 'TextInput')
  );
};

const isTouchResponder = (element?: ReactTestInstance) => {
  if (!isHostElement(element)) return false;

  return !!element?.props.onStartShouldSetResponder || isTextInput(element);
};

const isPointerEventEnabled = (
  element?: ReactTestInstance,
  isParent?: boolean
): boolean => {
  const parentCondition = isParent
    ? element?.props.pointerEvents === 'box-only'
    : element?.props.pointerEvents === 'box-none';

  if (element?.props.pointerEvents === 'none' || parentCondition) {
    return false;
  }

  if (!element?.parent) return true;

  return isPointerEventEnabled(element.parent, true);
};

const isTouchEvent = (eventName?: string) => {
  return eventName === 'press';
};

const isEventEnabled = (
  element?: ReactTestInstance,
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

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const pressHandler = (element: ReactTestInstance, ...data: Array<any>): void =>
  invokeEvent(element, 'press', ...data);
const changeTextHandler = (
  element: ReactTestInstance,
  ...data: Array<any>
): void => invokeEvent(element, 'changeText', ...data);
const scrollHandler = (element: ReactTestInstance, ...data: Array<any>): void =>
  invokeEvent(element, 'scroll', ...data);

const fireEvent = (
  element: ReactTestInstance,
  eventName: string,
  ...data: Array<any>
): void => invokeEvent(element, eventName, ...data);

fireEvent.press = pressHandler;
fireEvent.changeText = changeTextHandler;
fireEvent.scroll = scrollHandler;

export default fireEvent;
