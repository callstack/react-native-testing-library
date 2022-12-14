import { ReactTestInstance } from 'react-test-renderer';
import { TextInput } from 'react-native';
import act from './act';
import { isHostElement } from './helpers/component-tree';
import { filterNodeByType } from './helpers/filterNodeByType';
import { createEvent } from './helpers/create-event';

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

const getCoreEventName = (eventOrHandlerName: string) => {
  if (
    eventOrHandlerName.startsWith('on') &&
    eventOrHandlerName[2] === eventOrHandlerName[2]?.toUpperCase()
  ) {
    const coreName = eventOrHandlerName.slice(2);
    return coreName.charAt(0).toLowerCase() + coreName.slice(1);
  }

  return eventOrHandlerName;
};

const fireEvent = (
  element: ReactTestInstance,
  eventName: string,
  ...data: any[]
): void => invokeEvent(element, eventName, ...data);

function getEventData(eventName: string, ...data: any[]) {
  // Legacy mode where user passes 2+ args
  if (data.length > 1) {
    return data;
  }

  // Legacy mode where user passes full event object
  if (data[0]?.nativeEvent != null) {
    return [data[0]];
  }

  // Mode where user passes optional event init data.
  const name = getCoreEventName(eventName);
  return [createEvent(name, data[0])];
}

function invokeEventWithDefaultData(
  element: ReactTestInstance,
  eventName: string,
  ...data: any[]
) {
  const eventData = getEventData(eventName, ...data);
  return invokeEvent(element, eventName, ...eventData);
}

// Regular events:
fireEvent.press = (element: ReactTestInstance, ...data: any[]) => {
  return invokeEventWithDefaultData(element, 'press', ...data);
};

fireEvent.scroll = (element: ReactTestInstance, ...data: any[]) => {
  return invokeEventWithDefaultData(element, 'scroll', ...data);
};

// changeText is not a regular event, as the callback args is just the changed not, and not an Event object
fireEvent.changeText = (element: ReactTestInstance, text: string) => {
  return invokeEvent(element, 'changeText', text);
};

export default fireEvent;
