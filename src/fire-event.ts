import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import type { HostElement } from 'universal-test-renderer';

import act from './act';
import { getEventHandler } from './event-handler';
import { isElementMounted } from './helpers/component-tree';
import { isHostScrollView, isHostTextInput } from './helpers/host-component-names';
import { isPointerEventEnabled } from './helpers/pointer-events';
import { isEditableTextInput } from './helpers/text-input';
import { nativeState } from './native-state';
import type { Point, StringWithAutocomplete } from './types';
import { EventBuilder } from './user-event/event-builder';

type EventHandler = (...args: unknown[]) => unknown;

export function isTouchResponder(element: HostElement) {
  return Boolean(element.props.onStartShouldSetResponder) || isHostTextInput(element);
}

/**
 * List of events affected by `pointerEvents` prop.
 *
 * Note: `fireEvent` is accepting both `press` and `onPress` for event names,
 * so we need cover both forms.
 */
const eventsAffectedByPointerEventsProp = new Set([
  'press',
  'onPress',
  'responderGrant',
  'responderRelease',
  'longPress',
  'pressIn',
  'pressOut',
]);

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
  element: HostElement,
  eventName: string,
  nearestTouchResponder?: HostElement,
) {
  if (nearestTouchResponder != null && isHostTextInput(nearestTouchResponder)) {
    return (
      isEditableTextInput(nearestTouchResponder) ||
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
  element: HostElement,
  eventName: string,
  nearestTouchResponder?: HostElement,
): EventHandler | null {
  const touchResponder = isTouchResponder(element) ? element : nearestTouchResponder;

  const handler = getEventHandler(element, eventName, { loose: true });
  if (handler && isEventEnabled(element, eventName, touchResponder)) {
    return handler;
  }

  // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
  if (element.parent === null || element.parent.parent === null) {
    return null;
  }

  return findEventHandler(element.parent, eventName, touchResponder);
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

function fireEvent(element: HostElement, eventName: EventName, ...data: unknown[]) {
  if (!isElementMounted(element)) {
    return;
  }

  setNativeStateIfNeeded(element, eventName, data[0]);

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

fireEvent.press = (element: HostElement, ...data: unknown[]) => {
  const nativeData =
    data.length === 1 &&
    typeof data[0] === 'object' &&
    data[0] !== null &&
    'nativeEvent' in data[0] &&
    typeof data[0].nativeEvent === 'object'
      ? data[0].nativeEvent
      : null;

  const responderGrantEvent = EventBuilder.Common.responderGrant();
  if (nativeData) {
    responderGrantEvent.nativeEvent = {
      ...responderGrantEvent.nativeEvent,
      ...nativeData,
    };
  }
  fireEvent(element, 'responderGrant', responderGrantEvent);

  fireEvent(element, 'press', ...data);

  const responderReleaseEvent = EventBuilder.Common.responderRelease();
  if (nativeData) {
    responderReleaseEvent.nativeEvent = {
      ...responderReleaseEvent.nativeEvent,
      ...nativeData,
    };
  }
  fireEvent(element, 'responderRelease', responderReleaseEvent);
};

fireEvent.changeText = (element: HostElement, ...data: unknown[]) =>
  fireEvent(element, 'changeText', ...data);

fireEvent.scroll = (element: HostElement, ...data: unknown[]) =>
  fireEvent(element, 'scroll', ...data);

export default fireEvent;

const scrollEventNames = new Set([
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
]);

function setNativeStateIfNeeded(element: HostElement, eventName: string, value: unknown) {
  if (eventName === 'changeText' && typeof value === 'string' && isEditableTextInput(element)) {
    nativeState.valueForElement.set(element, value);
  }

  if (scrollEventNames.has(eventName) && isHostScrollView(element)) {
    const contentOffset = tryGetContentOffset(value);
    if (contentOffset) {
      nativeState.contentOffsetForElement.set(element, contentOffset);
    }
  }
}

function tryGetContentOffset(event: unknown): Point | null {
  try {
    // @ts-expect-error: try to extract contentOffset from the event value
    const contentOffset = event?.nativeEvent?.contentOffset;
    const x = contentOffset?.x;
    const y = contentOffset?.y;
    if (typeof x === 'number' || typeof y === 'number') {
      return {
        x: Number.isFinite(x) ? x : 0,
        y: Number.isFinite(y) ? y : 0,
      };
    }
  } catch {
    // Do nothing
  }

  return null;
}
