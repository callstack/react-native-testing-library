import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';

import act from './act';
import { getEventHandler } from './event-handler';
import { isElementMounted, isHostElement } from './helpers/component-tree';
import { formatElement } from './helpers/format-element';
import { isHostScrollView, isHostTextInput } from './helpers/host-component-names';
import { logger } from './helpers/logger';
import { isPointerEventEnabled } from './helpers/pointer-events';
import { isEditableTextInput } from './helpers/text-input';
import { nativeState } from './native-state';
import type { Point, StringWithAutocomplete } from './types';

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

type FindEventHandlerState = {
  nearestTouchResponder?: ReactTestInstance;
  disabledElements: ReactTestInstance[];
  targetElement: ReactTestInstance;
};

function findEventHandler(
  element: ReactTestInstance,
  eventName: string,
  state: FindEventHandlerState = {
    disabledElements: [],
    targetElement: element,
  },
): EventHandler | null {
  const touchResponder = isTouchResponder(element) ? element : state.nearestTouchResponder;

  const handler = getEventHandler(element, eventName, { loose: true });
  if (handler) {
    const isEnabled = isEventEnabled(element, eventName, touchResponder);
    if (isEnabled) {
      return handler;
    } else {
      state.disabledElements.push(element);
    }
  }

  if (element.parent === null) {
    logger.warn(formatEnabledEventHandlerNotFound(eventName, state));
    return null;
  }

  return findEventHandler(element.parent, eventName, {
    ...state,
    nearestTouchResponder: touchResponder,
  });
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

fireEvent.press = (element: ReactTestInstance, ...data: unknown[]) =>
  fireEvent(element, 'press', ...data);

fireEvent.changeText = (element: ReactTestInstance, ...data: unknown[]) =>
  fireEvent(element, 'changeText', ...data);

fireEvent.scroll = (element: ReactTestInstance, ...data: unknown[]) =>
  fireEvent(element, 'scroll', ...data);

async function fireEventAsync(
  element: ReactTestInstance,
  eventName: EventName,
  ...data: unknown[]
) {
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

fireEventAsync.press = async (element: ReactTestInstance, ...data: unknown[]) =>
  await fireEventAsync(element, 'press', ...data);

fireEventAsync.changeText = async (element: ReactTestInstance, ...data: unknown[]) =>
  await fireEventAsync(element, 'changeText', ...data);

fireEventAsync.scroll = async (element: ReactTestInstance, ...data: unknown[]) =>
  await fireEventAsync(element, 'scroll', ...data);

export { fireEventAsync };
export default fireEvent;

const scrollEventNames = new Set([
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
]);

function setNativeStateIfNeeded(element: ReactTestInstance, eventName: string, value: unknown) {
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

function formatEnabledEventHandlerNotFound(eventName: string, state: FindEventHandlerState) {
  if (state.disabledElements.length === 0) {
    return `Fire Event: no event handler for "${eventName}" event found on ${formatElement(
      state.targetElement,
      {
        compact: true,
      },
    )} or any of its ancestors.`;
  }

  return `Fire Event: no enabled event handler for "${eventName}" event found. Found disabled event handler(s) on:\n${state.disabledElements
    .map(
      (e) =>
        ` - ${formatElement(e, { compact: true })}${
          typeof e.type === 'string' ? '' : ' (composite element)'
        }`,
    )
    .join('\n')}`;
}
