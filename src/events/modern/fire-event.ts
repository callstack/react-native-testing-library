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
import { createEvent } from './event';
import {
  ensureEventType,
  ensureSingleEventArg,
  validateChangeTextArgs,
  validateEventInit,
} from './fire-event-utils';

/**
 * Event object passed to modern `fireEvent`. Handlers receive a `SyntheticEvent` from
 * `createEvent()`, with `nativeEvent` as its `nativeEvent`.
 */
export type FireEventInit = CreateEventInit;

/**
 * Fires an event on a host element: `createEvent()`, then `dispatchEvent()`, like Testing Library's
 * DOM `fireEvent(element, event)`. The event type is needed to find the event's dispatch config.
 *
 * Exactly one event object is required, as React Native handlers receive a single event. Event
 * types React Native doesn't dispatch natively (`changeText`, custom prop names) throw.
 *
 * @param eventType with or without the `on*` prefix, e.g. `focus` or `onFocus`
 * @returns `false` if a handler called `preventDefault()`, otherwise `true`.
 */
export async function fireEvent(
  instance: TestInstance,
  eventType: string,
  ...args: [event: FireEventInit]
): Promise<boolean> {
  const normalizedType = normalizeEventType(eventType);
  ensureInstance(instance, normalizedType, fireEvent);
  // Before the event object, as `fireEvent(input, 'changeText', 'Hello')` needs the hint more.
  ensureEventType(normalizedType, fireEvent);
  ensureSingleEventArg(normalizedType, args, fireEvent);
  const init = validateEventInit(normalizedType, args[0], fireEvent);
  return await fireEventInternal(instance, normalizedType, init);
}

/**
 * Changes the text of a `TextInput` as a device does: fires a `change` event with the new text,
 * and calls `onChangeText(text)` right after the input's own `onChange`, as `TextInput` does from
 * its `onChange` wrapper. Ancestors receive the bubbling `onChange`, but never `onChangeText`.
 * A non-editable `TextInput` receives no events, as on a device.
 *
 * @returns `false` if a handler called `preventDefault()`, otherwise `true`.
 */
fireEvent.changeText = async (instance: TestInstance, text: string): Promise<boolean> => {
  ensureInstance(instance, 'changeText', fireEvent.changeText);
  validateChangeTextArgs(instance, text, fireEvent.changeText);
  if (!isEditableTextInput(instance)) {
    return true;
  }

  const selection = { start: text.length, end: text.length };
  const payload = buildTextChangeNativeEvent(text, selection);
  const dispatchOptions: DispatchOptions = {
    afterTargetHandler: (target) => {
      getEventHandlerFromProps(target.props, 'changeText')?.(text);
    },
  };

  return await fireEventInternal(instance, 'change', {}, payload, dispatchOptions);
};

/**
 * Not supported yet. `press` needs the responder system, which `Pressable` and `Touchable*` use
 * to get touches, as their host `View` has no `onPress`. Throws, so tests don't pass without the
 * handler being called.
 */
fireEvent.press = (_instance: TestInstance, _event?: FireEventInit): Promise<boolean> =>
  Promise.reject(
    new ErrorWithStack(
      'fireEvent.press() is not supported yet in the modern event system. Use userEvent.press() instead.',
      fireEvent.press,
    ),
  );

/**
 * Fires a `scroll` event. The passed `nativeEvent` is deep merged onto a default scroll payload,
 * whose `layoutMeasurement` is the `ScrollView`'s size from its last `layout` event.
 */
fireEvent.scroll = async (instance: TestInstance, event: FireEventInit = {}): Promise<boolean> => {
  ensureInstance(instance, 'scroll', fireEvent.scroll);
  const init = validateEventInit('scroll', event, fireEvent.scroll);
  return await fireEventInternal(instance, 'scroll', init, buildScrollNativeEvent());
};

/** Fires a `layout` event. The passed `layout` is merged onto a zeroed rectangle. */
fireEvent.layout = async (
  instance: TestInstance,
  layout?: Partial<LayoutRectangle>,
): Promise<boolean> => {
  ensureInstance(instance, 'layout', fireEvent.layout);
  return await fireEventInternal(instance, 'layout', {}, buildLayoutNativeEvent(layout));
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
): Promise<boolean> {
  const nativeEvent = basePayload
    ? mergeEventProps(basePayload, getNativeStateEventProps(instance, eventType), init.nativeEvent)
    : init.nativeEvent;
  const event = createEvent(eventType, { ...init, nativeEvent });
  if (event == null) {
    return true;
  }

  // Before the dispatch, as a device updates its native views before emitting the event.
  if (isInstanceMounted(instance)) {
    updateNativeStateFromEvent(instance, eventType, event);
  }

  await dispatchEvent(instance, event, dispatchOptions);
  return !event.defaultPrevented;
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
