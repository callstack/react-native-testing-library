import { ErrorWithStack } from '../helpers/errors';
import { logger } from '../helpers/logger';
import { hasOnPrefix, normalizeEventType } from './shared/handler';

/**
 * Throws when more than one argument follows the event type in modern `fireEvent`, as React Native
 * handlers receive a single event. Catches legacy calls passing several handler arguments.
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

/**
 * Warns for the deprecated `on` prefix (`onPress`), which modern `fireEvent` still strips, as legacy
 * `fireEvent` does. To be removed in the next major release.
 */
export function warnOnPrefix(eventType: string): void {
  if (!hasOnPrefix(eventType)) {
    return;
  }

  const unprefixedType = normalizeEventType(eventType);
  logger.warn(
    `Passing event types with the "on" prefix ("${eventType}") to fireEvent is deprecated and ` +
      'will be removed in the next major release. ' +
      `Use "${unprefixedType}" instead, e.g. fireEvent(element, '${unprefixedType}', { nativeEvent: {} }).`,
  );
}
