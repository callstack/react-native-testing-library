import type { TestInstance } from 'test-renderer';

import type { LegacyEvent } from './create-event';
import { dispatchEvent as dispatchLegacyEvent } from './legacy/dispatch';
import { dispatchEvent as dispatchModernEvent } from './modern/dispatch';
import { SyntheticEvent } from './modern/event';

/**
 * Dispatches an event from `createEvent()` to a host element. Used by `userEvent`.
 *
 * - Legacy event object: calls the element's own `on*` prop with it.
 * - `SyntheticEvent`: dispatched as React Native does (capture and bubble phases for bubbling
 *   events). `press` is a native event type (`topPress`), so it reaches host `onPress` props only,
 *   not `Pressable`'s `onPress`.
 *
 * @param eventType a native event type without the `on*` prefix, e.g. `focus`
 * @returns `true` if a handler was called.
 */
export async function dispatchEvent(
  instance: TestInstance,
  eventType: string,
  event: LegacyEvent | SyntheticEvent,
): Promise<boolean> {
  if (event instanceof SyntheticEvent) {
    return await dispatchModernEvent(instance, event);
  }

  return await dispatchLegacyEvent(instance, eventType, event);
}
