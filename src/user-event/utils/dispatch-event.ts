import type { HostElement } from 'universal-test-renderer';

import act from '../../act';
import { getEventHandler } from '../../event-handler';
import { isElementMounted } from '../../helpers/component-tree';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 */
export async function dispatchEvent(element: HostElement, eventName: string, ...event: unknown[]) {
  if (!isElementMounted(element)) {
    return;
  }

  const handler = getEventHandler(element, eventName);
  if (!handler) {
    return;
  }

  // eslint-disable-next-line require-await
  await act(async () => {
    handler(...event);
  });
}
