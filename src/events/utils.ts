import { ErrorWithStack } from '../helpers/errors';

/**
 * Throws when more than one argument follows the event type in modern `fireEvent`, as React Native
 * handlers receive a single event. Catches legacy calls passing several handler arguments. No
 * argument is fine: the event object is optional.
 *
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function ensureAtMostOneEventArg(
  eventType: string,
  args: unknown[],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): void {
  if (args.length > 1) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Expected a single event object, ` +
        `received ${args.length} arguments. To call a handler prop with custom arguments, ` +
        'use UNSAFE_invokeHandler().',
      callsite,
    );
  }
}
