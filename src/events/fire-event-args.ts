import type { TestInstance } from 'test-renderer';

import { ErrorWithStack } from '../helpers/errors';
import { logger } from '../helpers/logger';
import { ensureInstanceForEvent } from './shared/assertions';
import { hasOnPrefix, normalizeEventType } from './shared/handler';

type NormalizedFireEventArgs = {
  /** Without the `on*` prefix, as modern `fireEvent` takes it. */
  eventType: string;
  event: unknown;
};

/**
 * Turns the arguments of the public `fireEvent` into those of modern `fireEvent`, checking them in
 * a fixed order: strips the deprecated `on*` prefix, throws for a missing element, throws for more
 * than one event argument, then warns for the prefix. Event type and event object checks stay in
 * modern `fireEvent`.
 *
 * The warning is logged here, before the dispatch, so it comes before any handler output, even if
 * a handler throws.
 *
 * @param args the arguments after the event type
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function normalizeModernFireEventArgs(
  instance: TestInstance,
  eventType: string,
  args: unknown[],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): NormalizedFireEventArgs {
  const normalizedType = normalizeEventType(eventType);
  ensureInstanceForEvent(instance, normalizedType, callsite);
  ensureAtMostOneEventArg(normalizedType, args, callsite);
  warnOnPrefix(eventType);
  return { eventType: normalizedType, event: args[0] };
}

/**
 * Throws when more than one argument follows the event type, as React Native handlers receive a
 * single event. Catches legacy calls passing several handler arguments.
 */
function ensureAtMostOneEventArg(
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
function warnOnPrefix(eventType: string): void {
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
