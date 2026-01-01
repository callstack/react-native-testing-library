import type { HostElement } from 'universal-test-renderer';

import act from '../../act';
import { getEventHandlerFromProps } from '../../event-handler';
import { isElementMounted } from '../../helpers/component-tree';

/**
 * Basic dispatch event function used by User Event module.
 *
 * @param element element trigger event on
 * @param eventName name of the event
 * @param event event payload(s)
 */
export function dispatchEvent(element: HostElement, eventName: string, ...event: unknown[]) {
  if (!isElementMounted(element)) {
    return;
  }

  const handler = getEventHandlerFromProps(element.props, eventName);
  if (!handler) {
    return;
  }

  // This will be called synchronously.
  void act(() => {
    handler(...event);
  });
}
