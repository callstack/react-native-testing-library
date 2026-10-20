import type { TestInstance } from 'test-renderer';

import { ErrorWithStack } from '../../helpers/errors';

/**
 * Throws when `fireEvent` gets no element, e.g. from a `queryBy*` query that found nothing.
 *
 * @param eventType without the `on*` prefix, e.g. `focus`
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function ensureInstanceForEvent(
  instance: TestInstance,
  eventType: string,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
) {
  if (instance == null) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Please provide a host element.`,
      callsite,
    );
  }
}
