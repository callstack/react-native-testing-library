import type { TestInstance } from 'test-renderer';

import { ErrorWithStack } from '../../helpers/errors';
import { normalizeEventType } from '../shared/handler';
import { dispatchEvent } from './dispatch';
import type { CreateEventInit } from './event';
import { createEvent } from './event';
import type { NativeEventType } from './event-types';
import { ensureEventType, validateEventInit } from './fire-event-utils';

/**
 * Event object passed to modern `fireEvent`. Handlers receive a `SyntheticEvent` from
 * `createEvent()`, with `nativeEvent` as its `nativeEvent`.
 */
export type FireEventInit = CreateEventInit;

/**
 * Event type React Native dispatches natively, with or without the `on*` prefix. JavaScript
 * callers can pass any string, so `fireEvent()` still checks it at runtime.
 */
export type FireEventType = NativeEventType | `on${Capitalize<NativeEventType>}`;

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
  eventType: FireEventType,
  ...args: [event: FireEventInit]
): Promise<boolean> {
  const normalizedType = normalizeEventType(eventType);
  if (instance == null) {
    throw new ErrorWithStack(
      `Unable to fire a "${normalizedType}" event - please provide a host element.`,
      fireEvent,
    );
  }

  // Before the event object, as `fireEvent(input, 'changeText', 'Hello')` needs the hint more.
  ensureEventType(normalizedType, fireEvent);
  const init = validateEventInit(normalizedType, args, fireEvent);
  const event = createEvent(normalizedType, init);
  if (event == null) {
    return true;
  }

  await dispatchEvent(instance, event);
  return !event.defaultPrevented;
}
