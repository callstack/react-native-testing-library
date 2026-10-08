import type { TestInstance } from 'test-renderer';

import { ErrorWithStack } from '../../helpers/errors';
import { normalizeEventType } from '../shared/handler';
import type { EventType } from '../shared/types';
import { dispatchEvent } from './dispatch';
import type { CreateEventInit } from './event';
import { createEvent } from './event';
import { validateEventInit } from './fire-event-utils';

/**
 * Event object passed to modern `fireEvent`. Handlers receive a `SyntheticEvent` from
 * `createEvent()`, with `nativeEvent` as its `nativeEvent`.
 */
export type FireEventInit = CreateEventInit;

/**
 * Fires an event on a host element: `createEvent()`, then `dispatchEvent()`, like Testing Library's
 * DOM `fireEvent(element, event)`. The event type is needed to find the event's dispatch config.
 *
 * Exactly one event object is required, as React Native handlers receive a single event.
 *
 * @param eventType with or without the `on*` prefix, e.g. `focus` or `onFocus`
 * @returns `false` if a handler called `preventDefault()`, otherwise `true`.
 */
export async function fireEvent(
  instance: TestInstance,
  eventType: EventType,
  ...args: [event: FireEventInit]
): Promise<boolean> {
  const normalizedType = normalizeEventType(eventType);
  if (instance == null) {
    throw new ErrorWithStack(
      `Unable to fire a "${normalizedType}" event - please provide a host element.`,
      fireEvent,
    );
  }

  const init = validateEventInit(normalizedType, args, fireEvent);
  const event = createEvent(normalizedType, init);
  if (event == null) {
    return true;
  }

  return await dispatchEvent(instance, event);
}
