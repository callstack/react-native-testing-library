import type { TestInstance } from "test-renderer";

import type { LegacyEvent } from "./create-event";
import { dispatchEvent as dispatchModernEvent } from "./modern/dispatch";
import { SyntheticEvent } from "./modern/event";
import { invokeEventHandler } from "./shared/invoke-event-handler";

/**
 * Dispatches an event from `createEvent()` to a host element. Used by `userEvent`.
 *
 * - `SyntheticEvent`: dispatched as React Native does (capture and bubble phases for bubbling
 *   events). `press` is a native event type (`topPress`), so it reaches host `onPress` props only,
 *   not `Pressable`'s `onPress`.
 * - Legacy event object: calls the element's own `on*` prop with it.
 *
 * @param eventType a native event type without the `on*` prefix, e.g. `focus`
 * @returns `true` if a handler was called.
 */
export async function dispatchEvent(
  instance: TestInstance,
  eventType: string,
  event: SyntheticEvent | LegacyEvent,
): Promise<boolean> {
  if (event instanceof SyntheticEvent) {
    return await dispatchModernEvent(instance, event);
  }

  return await invokeEventHandler(instance, eventType, event);
}
