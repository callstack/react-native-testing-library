import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { getEventHandlerFromProps } from '../../event-handler';
import { isInstanceMounted } from '../../helpers/component-tree';

/**
 * Basic dispatch event function used by User Event module.
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

  await act(() => {
    handler(...event);
  });
}
