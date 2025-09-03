import type { ReactTestInstance } from 'react-test-renderer';

import act from '../../act';
import { getEventHandler } from '../../event-handler';
import { isElementMounted } from '../../helpers/component-tree';
import { formatElement } from '../../helpers/format-element';
import { logger } from '../../helpers/logger';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 */
export async function dispatchEvent(
  element: ReactTestInstance,
  eventName: string,
  ...event: unknown[]
) {
  if (!isElementMounted(element)) {
    return;
  }

  const handler = getEventHandler(element, eventName);
  if (!handler) {
    logger.warn(
      `User Event: no event handler for "${eventName}" found on ${formatElement(element, {
        compact: true,
      })}`,
    );
    return;
  }

  // eslint-disable-next-line require-await
  await act(async () => {
    handler(...event);
  });
}
