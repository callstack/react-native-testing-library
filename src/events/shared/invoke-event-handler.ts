import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { getEventHandlerFromProps } from './handler';

/**
 * Calls the element's own handler prop for the event type (`onChangeText`, or
 * `testOnly_onChangeText`) with the given params, in `act()`. For callbacks that components call
 * from JavaScript instead of dispatching native events, e.g. `ScrollView`'s
 * `onContentSizeChange(width, height)`.
 *
 * @param eventType without the `on*` prefix, e.g. `changeText`
 * @returns `true` if a handler was called.
 */
export async function invokeEventHandler(
  instance: TestInstance,
  eventType: string,
  ...params: unknown[]
): Promise<boolean> {
  if (!isInstanceMounted(instance)) {
    return false;
  }

  const handler = getEventHandlerFromProps(instance.props, eventType);
  if (!handler) {
    return false;
  }

  await act(() => {
    handler(...params);
  });

  return true;
}
