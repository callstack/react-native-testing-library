import type { TestInstance } from 'test-renderer';

import { act } from '../act';
import { isInstanceMounted } from '../helpers/component-tree';
import type { EventHandler } from './handler';
import { getEventHandlerFromProps } from './handler';
import { findEventHandler } from './propagation';

/**
 * Dispatches the event to the instance's own handler only. Used by User Event module,
 * where each action does its own enabled checks.
 *
 * @param instance instance to trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 */
export async function dispatchEvent(
  instance: TestInstance,
  eventName: string,
  ...event: unknown[]
) {
  if (!isInstanceMounted(instance)) {
    return;
  }

  const handler = getEventHandlerFromProps(instance.props, eventName);
  if (!handler) {
    return;
  }

  await invokeEventHandler(handler, event);
}

/**
 * Dispatches the event the way `fireEvent` does: bubbling events go up the tree to the
 * nearest enabled handler, direct events only reach the target.
 *
 * @returns value returned by the handler
 */
export async function propagateEvent(
  instance: TestInstance,
  eventName: string,
  ...event: unknown[]
) {
  if (!isInstanceMounted(instance)) {
    return;
  }

  const handler = findEventHandler(instance, eventName);
  if (!handler) {
    return;
  }

  return await invokeEventHandler(handler, event);
}

async function invokeEventHandler(handler: EventHandler, event: unknown[]) {
  let returnValue;
  await act(() => {
    returnValue = handler(...event);
  });

  return returnValue;
}
