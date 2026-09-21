import type {
  PressableProps,
  ScrollViewProps,
  TextInputProps,
  TextProps,
  ViewProps,
} from 'react-native';
import type { Fiber, TestInstance } from 'test-renderer';

import { act } from './act';
import { getConfig } from './config';
import type { LayoutRectangle } from './event-builder';
import { buildLayoutEvent, buildScrollEvent, buildTouchEvent } from './event-builder';
import type { EventHandler } from './event-handler';
import { getEventHandlerFromProps } from './event-handler';
import { computeAriaDisabled } from './helpers/accessibility';
import { isInstanceMounted } from './helpers/component-tree';
import { isHostScrollView, isHostTextInput } from './helpers/host-component-names';
import { logger } from './helpers/logger';
import { isPointerEventEnabled } from './helpers/pointer-events';
import { isEditableTextInput } from './helpers/text-input';
import { nativeState } from './native-state';
import type { Point, StringWithAutocomplete } from './types';

function isTouchResponder(instance: TestInstance) {
  return Boolean(instance.props.onStartShouldSetResponder) || isHostTextInput(instance);
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

function isEventEnabled(
  instance: TestInstance,
  eventName: string,
  nearestTouchResponder?: TestInstance,
) {
  if (nearestTouchResponder != null && isHostTextInput(nearestTouchResponder)) {
    return (
      isEditableTextInput(nearestTouchResponder) ||
      textInputEventsIgnoringEditableProp.has(eventName)
    );
  }

  if (eventsAffectedByPointerEventsProp.has(eventName) && !isPointerEventEnabled(instance)) {
    return false;
  }

  const touchStart = nearestTouchResponder?.props.onStartShouldSetResponder?.();
  const touchMove = nearestTouchResponder?.props.onMoveShouldSetResponder?.();
  if (touchStart || touchMove) {
    return true;
  }

  return touchStart === undefined && touchMove === undefined;
}

// Carries state across the recursive `findEventHandler` walk. `rejectedTargetRef` is
// filled in with the element that owned the nearest handler rejected by `isEventEnabled`,
// so callers can report *why* no handler ran without re-walking the tree themselves.
type FindEventHandlerContext = {
  nearestTouchResponder?: TestInstance;
  rejectedTargetRef: { current: TestInstance | null };
};

function findEventHandler(
  instance: TestInstance,
  eventName: string,
  context: FindEventHandlerContext,
): EventHandler | null {
  const touchResponder = isTouchResponder(instance) ? instance : context.nearestTouchResponder;

  const handler =
    getEventHandlerFromProps(instance.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventName);

  if (handler) {
    if (isEventEnabled(instance, eventName, touchResponder)) {
      return handler;
    }

    // Keep only the first (nearest to the fired instance) rejection.
    if (context.rejectedTargetRef.current == null) {
      context.rejectedTargetRef.current = touchResponder ?? instance;
    }
  }

  if (instance.parent === null) {
    return null;
  }

  return findEventHandler(instance.parent, eventName, {
    ...context,
    nearestTouchResponder: touchResponder,
  });
}

function findEventHandlerFromFiber(fiber: Fiber | null, eventName: string): EventHandler | null {
  // Container fibers have memoizedProps set to null
  if (!fiber?.memoizedProps) {
    return null;
  }

  const handler = getEventHandlerFromProps(fiber.memoizedProps, eventName, {
    loose: true,
  });
  if (handler) {
    return handler;
  }

  // No parent fiber or we reached another host element
  if (fiber.return === null || typeof fiber.return.type === 'string') {
    return null;
  }

  return findEventHandlerFromFiber(fiber.return, eventName);
}

function isWarnableDisabledTarget(target: TestInstance): boolean {
  // `computeAriaDisabled` treats non-editable TextInput as disabled for a11y purposes,
  // but firing events on it is expected, not a bug worth warning about.
  if (isHostTextInput(target) && !isEditableTextInput(target)) {
    return false;
  }

  return computeAriaDisabled(target);
}

/**
 * Warns when no handler ran because the target is disabled.
 * Opt out via `configure({ warnOnDisabledElementEvent: false })`.
 */
function warnAboutDisabledEventTarget(target: TestInstance | null, eventName: string) {
  if (!getConfig().warnOnDisabledElementEvent || target == null) {
    return;
  }

  if (!isWarnableDisabledTarget(target)) {
    return;
  }

  logger.warn(
    `Tried to fire the "${eventName}" event on a disabled element, so no handler was called.\n` +
      'If this is intentional, you can disable this warning via `configure({ warnOnDisabledElementEvent: false })`.',
  );
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

async function fireEvent(instance: TestInstance, eventName: EventName, ...data: unknown[]) {
  if (!isInstanceMounted(instance)) {
    return;
  }

  setNativeStateIfNeeded(instance, eventName, data[0]);

  const context: FindEventHandlerContext = { rejectedTargetRef: { current: null } };
  const handler = findEventHandler(instance, eventName, context);
  if (!handler) {
    warnAboutDisabledEventTarget(context.rejectedTargetRef.current, eventName);
    return;
  }

  let returnValue;
  await act(() => {
    returnValue = handler(...data);
  });

  return returnValue;
}

type EventProps = Record<string, unknown>;

fireEvent.changeText = async (instance: TestInstance, text: string) =>
  await fireEvent(instance, 'changeText', text);

fireEvent.press = async (instance: TestInstance, eventProps?: EventProps) => {
  const event = buildTouchEvent();
  if (eventProps) {
    mergeEventProps(event, eventProps);
  }

  await fireEvent(instance, 'press', event);
};

fireEvent.scroll = async (instance: TestInstance, eventProps?: EventProps) => {
  const event = buildScrollEvent();
  if (eventProps) {
    mergeEventProps(event, eventProps);
  }

  await fireEvent(instance, 'scroll', event);
};

fireEvent.layout = async (instance: TestInstance, layout?: Partial<LayoutRectangle>) => {
  await fireEvent(instance, 'layout', buildLayoutEvent(layout));
};

export { fireEvent };

const scrollEventNames = new Set([
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
]);

function setNativeStateIfNeeded(instance: TestInstance, eventName: string, value: unknown) {
  if (eventName === 'changeText' && typeof value === 'string' && isEditableTextInput(instance)) {
    nativeState.valueForInstance.set(instance, value);
  }

  if (scrollEventNames.has(eventName) && isHostScrollView(instance)) {
    const contentOffset = tryGetContentOffset(value);
    if (contentOffset) {
      nativeState.contentOffsetForInstance.set(instance, contentOffset);
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

function mergeEventProps(target: Record<string, unknown>, source: Record<string, unknown>) {
  for (const key of Object.keys(source)) {
    const sourceValue = source[key];
    const targetValue = target[key];
    if (
      sourceValue != null &&
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      targetValue &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue)
    ) {
      mergeEventProps(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      );
    } else {
      target[key] = sourceValue;
    }
  }
}
