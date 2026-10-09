import type { TestInstance } from 'test-renderer';

import { getConfig } from '../config';
import { isObject } from '../helpers/object';
import { dispatchEvent as dispatchLegacyEvent } from './legacy/dispatch';
import { dispatchEvent as dispatchModernEvent } from './modern/dispatch';
import type { NativeEventPayload } from './modern/event';
import { createEvent } from './modern/event';
import { getEventTypeConfig } from './modern/event-types';
import { invokeEventHandler } from './shared/invoke-event-handler';

/**
 * Dispatches an event to a host element with the event system selected by
 * `configure({ eventSystem })`. Used by `userEvent`.
 *
 * - `legacy`: calls the element's own `on*` prop with `event` as it is.
 * - `modern`: native events (`focus`, `change`, `scroll`, ...) get a `SyntheticEvent` from
 *   `event.nativeEvent` and `event.timeStamp`, dispatched as React Native does (capture and bubble
 *   phases for bubbling events). Callbacks that components call from JavaScript (`changeText`,
 *   `pressIn`, `responderGrant`, ...) are called as in `legacy`. `press` is a native event type
 *   (`topPress`), so it reaches host `onPress` props only, not `Pressable`'s `onPress`.
 *
 * @param eventType without the `on*` prefix, e.g. `focus`
 * @param event the event object, e.g. from `buildFocusEvent()`, or the callback's argument, e.g.
 * the text for `changeText`
 * @returns `true` if a handler was called.
 */
export async function dispatchEvent(
  instance: TestInstance,
  eventType: string,
  event: unknown,
): Promise<boolean> {
  if (getConfig().eventSystem === 'legacy') {
    return await dispatchLegacyEvent(instance, eventType, event);
  }

  const nativeEvent = extractNativeEvent(eventType, event);
  const syntheticEvent =
    nativeEvent != null
      ? createEvent(eventType, { nativeEvent, timeStamp: extractTimeStamp(event) })
      : null;
  if (syntheticEvent == null) {
    return await invokeEventHandler(instance, eventType, event);
  }

  return await dispatchModernEvent(instance, syntheticEvent);
}

function extractNativeEvent(eventType: string, event: unknown): NativeEventPayload | null {
  if (getEventTypeConfig(eventType) == null) {
    return null;
  }

  if (!isObject(event) || !isObject(event.nativeEvent)) {
    return null;
  }

  return event.nativeEvent;
}

/** Returns the event's top-level `timeStamp`, e.g. `0` from the event builders. */
function extractTimeStamp(event: unknown): number | undefined {
  return isObject(event) && typeof event.timeStamp === 'number' ? event.timeStamp : undefined;
}
