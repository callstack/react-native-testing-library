import type { TestInstance } from 'test-renderer';

import { invokeEventHandler } from '../shared/invoke-event-handler';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param instance instance to trigger event on
 * @param eventType type of the event
 * @param event event payload
 * @returns `true` if a handler was called.
 */
export async function dispatchEvent(
  instance: TestInstance,
  eventType: string,
  event: unknown,
): Promise<boolean> {
  return await invokeEventHandler(instance, eventType, event);
}
