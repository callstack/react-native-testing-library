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
  callsite?: any,
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

  return findEventHandler(element.parent, eventName, callsite, touchResponder);
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
  callsite?: any,
  ...callBackValues: Array<any>
) => {
  const handler = findEventHandler(element, eventName, callsite);

  if (!handler) {
    return;
  }

  let returnValue;

  act(() => {
    returnValue = handler(...callBackValues);
  });

  return returnValue;
};

const toEventHandlerName = (eventName: string) =>
  `on${eventName.charAt(0).toUpperCase()}${eventName.slice(1)}`;

const changeTextHandler = (
  element: ReactTestInstance,
  ...data: Array<any>
): void => {
  invokeEvent(element, 'changeText', changeTextHandler, ...data);
};

const generatedEventObject = (eventName: string) => {
  // This should use the (as-yet nonexistent) event map to return a "real" object, just like
  // https://github.com/testing-library/dom-testing-library/blob/29a17cb5f14b0f30f08a29172e35e55c3e8ba529/src/event-map.js#L0-L1
  return { eventName: eventName };
};

const addHandler = (eventName: string) => {
  return (element: ReactTestInstance, ...data: Array<any>): void => {
    const callBackValue =
      data.length > 0 ? data : [generatedEventObject(eventName)];
    invokeEvent(element, eventName, addHandler, ...callBackValue);
  };
};

type FireEvent = {
  (element: ReactTestInstance, eventName: string, ...data: Array<any>): void;
  [key: string]: (element: ReactTestInstance, ...data: Array<any>) => void;
};

const fireEvent = <FireEvent>(
  ((element: ReactTestInstance, eventName: string, ...data: Array<any>) =>
    invokeEvent(element, eventName, fireEvent, ...data))
);

fireEvent['changeText'] = changeTextHandler;

// map.keys.forEach ...
['press', 'scroll'].forEach((eventName: string) => {
  fireEvent[eventName] = addHandler(eventName);
});

export default fireEvent;
