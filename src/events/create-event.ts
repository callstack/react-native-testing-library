import { getConfig } from '../config';
import type { Point, Size, TextRange } from '../types';
import { wrapNativeEvent } from './legacy/builders/base';
import type { NativeEventPayload, SyntheticEvent } from './modern/event';
import { createEvent as createModernEvent } from './modern/event';
import { getEventTypeConfig } from './modern/event-types';
import type { ScrollNativeEventOptions } from './shared/payloads';
import {
  buildAccessibilityActionNativeEvent,
  buildBlurNativeEvent,
  buildContentSizeChangeNativeEvent,
  buildEndEditingNativeEvent,
  buildFocusNativeEvent,
  buildKeyPressNativeEvent,
  buildScrollNativeEvent,
  buildSubmitEditingNativeEvent,
  buildTextChangeNativeEvent,
  buildTextSelectionChangeNativeEvent,
  buildTouchNativeEvent,
} from './shared/payloads';

export type LegacyEvent = ReturnType<typeof wrapNativeEvent<NativeEventPayload>>;

/**
 * Creates the event object for a native event (`focus`, `change`, `scroll`, ...) in the event
 * system selected by `configure({ unstable_eventSystem })`: a legacy event object with stubs, or a
 * `SyntheticEvent`. Used by `userEvent`, with `dispatchEvent()`. Unlike modern `createEvent()`,
 * takes the `nativeEvent` itself, not an init object.
 *
 * Callbacks that components call from JavaScript (`changeText`, `pressIn`, `responderGrant`, ...)
 * aren't native events. Call them with `invokeEventHandler()`.
 *
 * @param eventType a native event type without the `on*` prefix, e.g. `focus`
 */
export function createEvent(
  eventType: string,
  nativeEvent: NativeEventPayload,
): LegacyEvent | SyntheticEvent {
  if (getEventTypeConfig(eventType) == null) {
    throw new Error(`"${eventType}" is not a native event type. Use invokeEventHandler() instead.`);
  }

  if (getConfig().unstable_eventSystem === 'legacy') {
    return wrapNativeEvent(nativeEvent);
  }

  // Not `null`: the event type is known.
  return createModernEvent(eventType, { nativeEvent }) as SyntheticEvent;
}

export function buildPressEvent() {
  return createEvent('press', buildTouchNativeEvent());
}

export function buildFocusEvent() {
  return createEvent('focus', buildFocusNativeEvent());
}

export function buildBlurEvent() {
  return createEvent('blur', buildBlurNativeEvent());
}

export function buildAccessibilityActionEvent(actionName: string) {
  return createEvent('accessibilityAction', buildAccessibilityActionNativeEvent(actionName));
}

export function buildScrollEvent(
  eventType: ScrollEventType,
  offset?: Point,
  options?: ScrollNativeEventOptions,
) {
  return createEvent(eventType, buildScrollNativeEvent(offset, options));
}

export function buildTextChangeEvent(text: string, range: TextRange) {
  return createEvent('change', buildTextChangeNativeEvent(text, range));
}

export function buildKeyPressEvent(key: string) {
  return createEvent('keyPress', buildKeyPressNativeEvent(key));
}

export function buildSubmitEditingEvent(text: string) {
  return createEvent('submitEditing', buildSubmitEditingNativeEvent(text));
}

export function buildEndEditingEvent(text: string) {
  return createEvent('endEditing', buildEndEditingNativeEvent(text));
}

export function buildTextSelectionChangeEvent(range: TextRange) {
  return createEvent('selectionChange', buildTextSelectionChangeNativeEvent(range));
}

export function buildContentSizeChangeEvent(size: Size) {
  return createEvent('contentSizeChange', buildContentSizeChangeNativeEvent(size));
}

type ScrollEventType =
  | 'scroll'
  | 'scrollBeginDrag'
  | 'scrollEndDrag'
  | 'momentumScrollBegin'
  | 'momentumScrollEnd';
