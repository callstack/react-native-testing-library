import { ReactTestInstance } from 'react-test-renderer';
import {
  ViewProps,
  TextProps,
  TextInputProps,
  PressableProps,
  ScrollViewProps,
} from 'react-native';
import act from './act';
import { isHostElement } from './helpers/component-tree';
import { isHostTextInput } from './helpers/host-component-names';
import { isPointerEventEnabled } from './helpers/pointer-events';
import { isTextInputEditable } from './helpers/text-input';
import { StringWithAutocomplete } from './types';
import { nativeState } from './native-state';

type EventHandler = (...args: unknown[]) => unknown;

export function isTouchResponder(element: ReactTestInstance) {
  if (!isHostElement(element)) {
    return false;
  }

  return Boolean(element.props.onStartShouldSetResponder) || isHostTextInput(element);
}

/**
 * List of events affected by `pointerEvents` prop.
 *
 * Note: `fireEvent` is accepting both `press` and `onPress` for event names,
 * so we need cover both forms.
 */
const eventsAffectedByPointerEventsProp = new Set(['press', 'onPress']);

/**
 * List of `TextInput` events not affected by `editable` prop.
 *
 * Note: `fireEvent` is accepting both `press` and `onPress` for event names,
 * so we need cover both forms.
 */
const textInputEventsIgnoringEditableProp = new Set([
  'contentSizeChange',
  'onContentSizeChange',
  'layout',
  'onLayout',
  'scroll',
  'onScroll',
]);

export function isEventEnabled(
  element: ReactTestInstance,
  eventName: string,
  nearestTouchResponder?: ReactTestInstance,
) {
  if (isHostTextInput(nearestTouchResponder)) {
    return (
      isTextInputEditable(nearestTouchResponder) ||
      textInputEventsIgnoringEditableProp.has(eventName)
    );
  }

  if (eventsAffectedByPointerEventsProp.has(eventName) && !isPointerEventEnabled(element)) {
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
  nearestTouchResponder?: ReactTestInstance,
): EventHandler | null {
  const touchResponder = isTouchResponder(element) ? element : nearestTouchResponder;

  const handler = getEventHandler(element, eventName);
  if (handler && isEventEnabled(element, eventName, touchResponder)) return handler;

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
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

// String union type of keys of T that start with on, stripped of 'on'
type EventNameExtractor<T> = keyof {
  [K in keyof T as K extends `on${infer Rest}` ? Uncapitalize<Rest> : never]: T[K];
};

type EventName = StringWithAutocomplete<
  | EventNameExtractor<ViewProps>
  | EventNameExtractor<TextProps>
  | EventNameExtractor<TextInputProps>
  | EventNameExtractor<PressableProps>
  | EventNameExtractor<ScrollViewProps>
>;

function fireEvent(element: ReactTestInstance, eventName: EventName, ...data: unknown[]) {
  if (eventName === 'changeText' && isHostTextInput(element) && typeof data[0] === 'string') {
    nativeState?.elementValues.set(element, data[0]);
  }

  const handler = findEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  let returnValue;
  void act(() => {
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
