import type { TestInstance } from 'test-renderer';

import { isInstanceMounted } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { isEditableTextInput } from '../../helpers/text-input';
import { getEventHandlerFromProps, normalizeEventType } from '../shared/handler';
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
import type { CreateEventInit, NativeEventPayload } from './event';
import { createEvent, createPressabilityEvent } from './event';
import type { PressabilityEventType } from './event-types';
import { isPressabilityEventType } from './event-types';
import {
  ensureEventType,
  ensureSingleEventArg,
  validateChangeTextArgs,
  validateEventInit,
} from './fire-event-utils';
import { dispatchPressabilityEvent } from './pressability';
import {
  warnAboutNonEditableTextInput,
  warnAboutUnhandledEvent,
  warnAboutUnhandledPressabilityEvent,
} from './warnings';

/**
 * Event object passed to modern `fireEvent`. Handlers receive a `SyntheticEvent` from
 * `createEvent()`, with `nativeEvent` as its `nativeEvent`.
 */
export type FireEventInit = CreateEventInit;

/**
 * Fires an event on a host element: `createEvent()`, then `dispatchEvent()`, like Testing Library's
 * DOM `fireEvent(element, event)`. The event type is needed to find the event's dispatch config.
 *
 * Pressability event types (`press`, `pressIn`, `pressOut`, `longPress`) call the callback of the
 * element that becomes the touch responder instead, as `fireEvent.press()` does.
 *
 * Exactly one event object is required, as React Native handlers receive a single event. Other
 * event types React Native doesn't dispatch natively (`changeText`, custom prop names) throw.
 *
 * Resolves to nothing, unlike DOM `fireEvent`: React Native has no default actions that
 * `preventDefault()` could cancel. Handlers can read `event.defaultPrevented` themselves.
 *
 * @param eventType with or without the `on*` prefix, e.g. `focus` or `onFocus`
 */
export async function fireEvent(
  instance: TestInstance,
  eventType: string,
  ...args: [event: FireEventInit]
): Promise<void> {
  const normalizedType = normalizeEventType(eventType);
  ensureInstance(instance, normalizedType, fireEvent);
  // Before the event object, as `fireEvent(input, 'changeText', 'Hello')` needs the hint more.
  ensureEventType(normalizedType, fireEvent);
  ensureSingleEventArg(normalizedType, args, fireEvent);
  const init = validateEventInit(normalizedType, args[0], fireEvent);
  if (isPressabilityEventType(normalizedType)) {
    await firePressabilityEvent(instance, normalizedType, init);
    return;
  }

  await fireEventInternal(instance, normalizedType, init);
}

/**
 * Changes the text of a `TextInput` as a device does: fires a `change` event with the new text,
 * and calls `onChangeText(text)` right after the input's own `onChange`, as `TextInput` does from
 * its `onChange` wrapper. Ancestors receive the bubbling `onChange`, but never `onChangeText`.
 * A non-editable `TextInput` receives no events, as on a device.
 */
fireEvent.changeText = async (instance: TestInstance, text: string): Promise<void> => {
  ensureInstance(instance, 'changeText', fireEvent.changeText);
  validateChangeTextArgs(instance, text, fireEvent.changeText);
  if (!isEditableTextInput(instance)) {
    if (isInstanceMounted(instance)) {
      warnAboutNonEditableTextInput(instance);
    }
    return;
  }

  const selection = { start: text.length, end: text.length };
  const payload = buildTextChangeNativeEvent(text, selection);
  const dispatchOptions: DispatchOptions = {
    afterTargetHandler: (target) => {
      getEventHandlerFromProps(target.props, 'changeText')?.(text);
    },
  };

  await fireEventInternal(instance, 'change', {}, payload, dispatchOptions);
};

/**
 * Presses the element: calls `onPress` of the element that becomes the touch responder, as a tap
 * on a device does. `Pressable` and `Touchable*` get it from their Pressability config, hosts with
 * their own `onPress` (mocked `Text`, `testOnly_onPress`) directly. Disabled elements and
 * responders that decline the touch pass it on to their ancestors. `pointerEvents` moves the touch
 * to the nearest ancestor it doesn't block. See `dispatchPressabilityEvent()`.
 *
 * Only `onPress` is called. Use `userEvent.press()` for `onPressIn`, `onPressOut` and timing.
 *
 * The passed `nativeEvent` is deep merged onto a default touch payload.
 */
fireEvent.press = async (instance: TestInstance, event: FireEventInit = {}): Promise<void> => {
  ensureInstance(instance, 'press', fireEvent.press);
  const init = validateEventInit('press', event, fireEvent.press);
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
 * Expects an event type React Native dispatches natively, without the `on*` prefix.
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
  const nativeEvent = basePayload
    ? mergeEventProps(basePayload, getNativeStateEventProps(instance, eventType), init.nativeEvent)
    : init.nativeEvent;
  const event = createEvent(eventType, { ...init, nativeEvent });
  if (event == null || !isInstanceMounted(instance)) {
    return;
  }

  // Before the dispatch, as a device updates its native views before emitting the event.
  const hasUpdatedNativeState = updateNativeStateFromEvent(instance, eventType, event);
  const hasCalledHandler = await dispatchEvent(instance, event, dispatchOptions);
  // The event still had an effect, e.g. `changeText` on an uncontrolled TextInput updates its value.
  if (!hasCalledHandler && !hasUpdatedNativeState) {
    warnAboutUnhandledEvent(instance, event);
  }
}

async function firePressabilityEvent(
  instance: TestInstance,
  eventType: PressabilityEventType,
  init: CreateEventInit,
): Promise<void> {
  const event = createPressabilityEvent(eventType, init);
  if (!isInstanceMounted(instance)) {
    return;
  }

  const hasCalledCallback = await dispatchPressabilityEvent(instance, eventType, event);
  if (!hasCalledCallback) {
    warnAboutUnhandledPressabilityEvent(instance, eventType);
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
