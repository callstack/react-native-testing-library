import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import type { Fiber, HostElement } from 'universal-test-renderer';

import act from './act';
import type { EventHandler } from './event-handler';
import { getEventHandlerFromProps } from './event-handler';
import { isElementMounted, isHostElement } from './helpers/component-tree';
import { isHostScrollView, isHostTextInput } from './helpers/host-component-names';
import { isPointerEventEnabled } from './helpers/pointer-events';
import { isEditableTextInput } from './helpers/text-input';
import { nativeState } from './native-state';
import type { Point, StringWithAutocomplete } from './types';

export function isTouchResponder(element: HostElement) {
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

  const handler =
    getEventHandlerFromProps(element.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(element.unstable_fiber, eventName);
  if (handler && isEventEnabled(element, eventName, touchResponder)) {
    return handler;
  }

  if (element.parent === null) {
    return null;
  }

  return findEventHandler(element.parent, eventName, touchResponder);
}

function findEventHandlerFromFiber(fiber: Fiber | null, eventName: string): EventHandler | null {
  // Container fibers have memoizedProps set to null
  if (!fiber?.memoizedProps) {
    return null;
  }

  const handler = getEventHandlerFromProps(fiber.memoizedProps, eventName, { loose: true });
  if (handler) {
    return handler;
  }

  // No parent fiber or we reached another host element
  if (fiber.return === null || typeof fiber.return.type === 'string') {
    return null;
  }

  return findEventHandlerFromFiber(fiber.return, eventName);
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

async function fireEvent(element: HostElement, eventName: EventName, ...data: unknown[]) {
  if (!isElementMounted(element)) {
    return;
  }

  setNativeStateIfNeeded(element, eventName, data[0]);

  const handler = findEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  let returnValue;
  // eslint-disable-next-line require-await
  await act(async () => {
    returnValue = handler(...data);
  });

  return returnValue;
}

fireEvent.press = async (element: HostElement, ...data: unknown[]) =>
  await fireEvent(element, 'press', ...data);

fireEvent.changeText = async (element: HostElement, ...data: unknown[]) =>
  await fireEvent(element, 'changeText', ...data);

fireEvent.scroll = async (element: HostElement, ...data: unknown[]) =>
  await fireEvent(element, 'scroll', ...data);

/** @deprecated - Use async `fireEvent` instead. */
function deprecated_fireEventSync(element: HostElement, eventName: EventName, ...data: unknown[]) {
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

/** @deprecated - Use async `fireEvent.press` instead. */
deprecated_fireEventSync.press = (element: HostElement, ...data: unknown[]) =>
  deprecated_fireEventSync(element, 'press', ...data);

/** @deprecated - Use async `fireEvent.changeText` instead. */
deprecated_fireEventSync.changeText = (element: HostElement, ...data: unknown[]) =>
  deprecated_fireEventSync(element, 'changeText', ...data);

/** @deprecated - Use async `fireEvent.scroll` instead. */
deprecated_fireEventSync.scroll = (element: HostElement, ...data: unknown[]) =>
  deprecated_fireEventSync(element, 'scroll', ...data);

export { fireEvent, deprecated_fireEventSync };

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
