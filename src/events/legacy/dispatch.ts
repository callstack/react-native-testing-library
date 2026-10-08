import type { TestInstance } from 'test-renderer';

import { invokeHandler } from '../shared/invoke-handler';

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
  return await invokeHandler(instance, eventType, event);
}
