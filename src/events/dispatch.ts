import type { TestInstance } from 'test-renderer';

import { act } from '../act';
import { isInstanceMounted } from '../helpers/component-tree';
import { getEventHandlerFromProps } from './handler';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param instance instance to trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 * @returns `true` if a handler was called.
 */
export async function dispatchEvent(
  instance: TestInstance,
  eventName: string,
  ...event: unknown[]
): Promise<boolean> {
  if (!isInstanceMounted(instance)) {
    return false;
  }

  const handler = getEventHandlerFromProps(instance.props, eventName);
  if (!handler) {
    return false;
  }

  await act(() => {
    handler(...event);
  });

  return true;
}
