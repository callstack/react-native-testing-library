import type { TestInstance } from 'test-renderer';

import { isInstanceMounted } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { getEventHandlerByEventType, normalizeEventType } from '../shared/handler';
import { mergeEventProps } from '../shared/merge';
import {
  buildLayoutNativeEvent,
  buildScrollNativeEvent,
  buildTextChangeNativeEvent,
} from '../shared/payloads';
import type { LayoutRectangle } from '../shared/types';
import {
  getNativeStateEventProps,
  updateNativeStateFromEvent,
} from '../shared/update-native-state';
import type { DispatchOptions } from './dispatch';
import { dispatchEvent } from './dispatch';
import { getEmittingTarget } from './emitting-target';
import type { CreateEventInit, NativeEventPayload } from './event';
import { createEvent } from './event';
import type { PressabilityEventType } from './event-types';
import { isPressabilityEventType } from './event-types';
import {
  ensureAtMostOneEventArg,
  ensureEventType,
  validateChangeTextArgs,
  validateEventInit,
  warnOnPrefix,
} from './fire-event-utils';
import { dispatchPressabilityEvent, findResponder, getTouchPath } from './pressability';
import { createPressabilityEvent } from './responder-event';
import { buildTouchPayload, isActiveTouchEventType, isTouchEventType } from './touch-payload';

/**
 * Event object passed to modern `fireEvent`. Handlers receive a `SyntheticEvent` from
 * `createEvent()`, with `nativeEvent` as its `nativeEvent`. `dispatch` is required for event types
 * React Native doesn't know, and overrides React Native's dispatch for the others.
 */
export type FireEventInit = CreateEventInit;

/**
 * Fires an event on a host element: `createEvent()`, then `dispatchEvent()`, like Testing Library's
 * DOM `fireEvent(element, event)`. The event type is needed to find the event's dispatch config.
 *
 * Pressability event types (`press`, `pressIn`, `pressOut`, `longPress`) call the callback of the
 * element that becomes the touch responder instead, as `fireEvent.press()` does.
 *
 * The event object is optional and defaults to `{}`. At most one is accepted, as React Native
 * handlers receive a single event. Event types React Native doesn't know need
 * `dispatch: 'direct' | 'bubbling'` in the event object, as declared by the native component, e.g.
 * a third-party component's `pageSelected`. Without it they throw, as do `changeText` and custom
 * prop names.
 *
 * Touch events (`touchStart`, `touchMove`, `touchEnd`, `touchCancel`) get a default touch payload,
 * with the passed `nativeEvent` deep merged onto it, as `fireEvent.press()` does. Other event types
 * get the passed `nativeEvent` as is.
 *
 * `dispatch` also overrides React Native's dispatch for known event types, for a native component
 * that declares its own event with a built-in name, e.g. a map's `BubblingEventHandler` `onPress`.
 * Pressability event types are then dispatched as native events, skipping Pressability.
 *
 * Like a device, drops events the element can't emit, and moves touch and pointer events to the
 * hit target. See `getEmittingTarget()`.
 *
 * Resolves to nothing, unlike DOM `fireEvent`: React Native has no default actions that
 * `preventDefault()` could cancel. Handlers can read `event.defaultPrevented` themselves.
 *
 * @param eventType without the `on*` prefix, as React Native names it, e.g. `focus`. The prefix
 * (`onFocus`) is deprecated and logs a warning.
 */
export async function fireEvent(
  instance: TestInstance,
  eventType: string,
  ...args: [event?: FireEventInit]
): Promise<void> {
  const normalizedType = normalizeEventType(eventType);
  ensureInstance(instance, normalizedType, fireEvent);
  // Before the event object, as `fireEvent(input, 'changeText', 'Hello')` needs the hint more.
  ensureEventType(normalizedType, args[0], fireEvent);
  ensureAtMostOneEventArg(normalizedType, args, fireEvent);
  // Explicit `undefined` too, as for an omitted optional parameter. `null` still throws.
  const event = args[0] === undefined ? {} : args[0];
  const init = validateEventInit(normalizedType, event, fireEvent);
  // After the checks, so a call that throws doesn't also warn.
  warnOnPrefix(eventType);
  if (isPressabilityEventType(normalizedType) && init.dispatch == null) {
    await firePressabilityEvent(instance, normalizedType, init);
    return;
  }

  if (isTouchEventType(normalizedType) && init.dispatch == null) {
    const nativeEvent = buildTouchPayload(isActiveTouchEventType(normalizedType), init.nativeEvent);
    await fireEventInternal(instance, normalizedType, { ...init, nativeEvent });
    return;
  }

  await fireEventInternal(instance, normalizedType, init);
}

/**
 * Changes the text of a `TextInput` as a device does: fires a `change` event with the new text,
 * and calls `onChangeText(text)` right after the input's own `onChange`, as `TextInput` does from
 * its `onChange` wrapper. Ancestors receive the bubbling `onChange`, but never `onChangeText`.
 * A non-editable `TextInput` receives no events, as on a device (see `getEmittingTarget()`).
 */
fireEvent.changeText = async (instance: TestInstance, text: string): Promise<void> => {
  ensureInstance(instance, 'changeText', fireEvent.changeText);
  validateChangeTextArgs(instance, text, fireEvent.changeText);
  const selection = { start: text.length, end: text.length };
  const payload = buildTextChangeNativeEvent(text, selection);
  const dispatchOptions: DispatchOptions = {
    afterTargetHandler: (target) => {
      getEventHandlerByEventType(target.props, 'changeText')?.(text);
    },
  };

  await fireEventInternal(instance, 'change', {}, payload, dispatchOptions);
};

/**
 * Presses the element: calls `onPress` of the element that becomes the touch responder, as a tap
 * on a device does. `Pressable` and `Touchable*` get it from their Pressability config, hosts with
 * their own `onPress` (mocked `Text`, `testOnly_onPress`) directly. Disabled elements and
 * responders that decline the touch pass it on to their ancestors. A `TextInput` always keeps the
 * touch, even without `onPress`. `pointerEvents` moves the touch to the nearest ancestor it doesn't
 * block. Nothing is called when `display: none` hides the element. See `getTouchPath()`, `findResponder()` and `dispatchPressabilityEvent()`.
 *
 * Only `onPress` is called. Use `userEvent.press()` for `onPressIn`, `onPressOut` and timing.
 *
 * The passed `nativeEvent` is deep merged onto a default touch payload. With `dispatch`, fires a
 * native `press` event with the passed `nativeEvent` instead, as `fireEvent()` does.
 */
fireEvent.press = async (instance: TestInstance, event: FireEventInit = {}): Promise<void> => {
  ensureInstance(instance, 'press', fireEvent.press);
  const init = validateEventInit('press', event, fireEvent.press);
  if (init.dispatch != null) {
    await fireEventInternal(instance, 'press', init);
    return;
  }

  await firePressabilityEvent(instance, 'press', init);
};

/**
 * Fires a `scroll` event. The passed `nativeEvent` is deep merged onto a default scroll payload,
 * whose `layoutMeasurement` is the `ScrollView`'s size from its last `layout` event.
 */
fireEvent.scroll = async (instance: TestInstance, event: FireEventInit = {}): Promise<void> => {
  ensureInstance(instance, 'scroll', fireEvent.scroll);
  const init = validateEventInit('scroll', event, fireEvent.scroll);
  await fireEventInternal(instance, 'scroll', init, buildScrollNativeEvent());
};

/** Fires a `layout` event. The passed `layout` is merged onto a zeroed rectangle. */
fireEvent.layout = async (
  instance: TestInstance,
  layout?: Partial<LayoutRectangle>,
): Promise<void> => {
  ensureInstance(instance, 'layout', fireEvent.layout);
  await fireEventInternal(instance, 'layout', {}, buildLayoutNativeEvent(layout));
};

/**
 * Expects an event type without the `on*` prefix, that React Native knows or that has `dispatch`.
 *
 * @param basePayload the payload a device would send. Native state, like a `ScrollView`'s
 * size, is merged onto it, then the passed `nativeEvent` is deep merged on top. Without it, the
 * passed `nativeEvent` is used as is.
 */
async function fireEventInternal(
  instance: TestInstance,
  eventType: string,
  init: CreateEventInit,
  basePayload?: NativeEventPayload,
  dispatchOptions?: DispatchOptions,
): Promise<void> {
  if (!isInstanceMounted(instance)) {
    return;
  }

  // Before native state, so a dropped `change` leaves it alone.
  const target = getEmittingTarget(instance, eventType, init);
  if (target == null) {
    return;
  }

  const nativeEvent = basePayload
    ? mergeEventProps(basePayload, getNativeStateEventProps(target, eventType), init.nativeEvent)
    : init.nativeEvent;
  const event = createEvent(eventType, { ...init, nativeEvent });

  // Before the dispatch, as a device updates its native views before emitting the event.
  updateNativeStateFromEvent(target, eventType, event);
  await dispatchEvent(target, event, dispatchOptions);
}

/** Touches the element and calls one Pressability callback of the touch responder. */
async function firePressabilityEvent(
  instance: TestInstance,
  eventType: PressabilityEventType,
  init: CreateEventInit,
): Promise<void> {
  const event = createPressabilityEvent(eventType, init);
  if (!isInstanceMounted(instance)) {
    return;
  }

  const path = getTouchPath(instance);
  const responder = findResponder(path);
  if (responder != null) {
    await dispatchPressabilityEvent(responder, [eventType], event, path[0]);
  }
}

function ensureInstance(
  instance: TestInstance,
  eventType: string,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
) {
  if (instance == null) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Please provide a host element.`,
      callsite,
    );
  }
}
