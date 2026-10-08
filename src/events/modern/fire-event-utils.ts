import { ErrorWithStack } from '../../helpers/errors';
import type { CreateEventInit } from './event';

const ALLOWED_INIT_KEYS = ['nativeEvent'];

/**
 * Validates the arguments following the event type in modern `fireEvent`: exactly one plain
 * object, with only a `nativeEvent` key, which must be a plain object if set.
 *
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function validateEventInit(
  eventType: string,
  args: unknown[],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): CreateEventInit {
  if (args.length === 0) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event - please provide an event object, ` +
        `e.g. fireEvent(element, '${eventType}', { nativeEvent: {} }).`,
      callsite,
    );
  }

  if (args.length > 1) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event - expected a single event object, ` +
        `received ${args.length} arguments.`,
      callsite,
    );
  }

  const [init] = args;
  if (!isPlainObject(init)) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event - expected an event object, ` +
        `received ${describeValue(init)}.`,
      callsite,
    );
  }

  const unknownKeys = Object.keys(init).filter((key) => !ALLOWED_INIT_KEYS.includes(key));
  if (unknownKeys.length > 0) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event - unsupported event object keys: ` +
        `${unknownKeys.map((key) => `"${key}"`).join(', ')}. ` +
        `Pass the event data as "nativeEvent".`,
      callsite,
    );
  }

  if (init.nativeEvent !== undefined && !isPlainObject(init.nativeEvent)) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event - expected "nativeEvent" to be an object, ` +
        `received ${describeValue(init.nativeEvent)}.`,
      callsite,
    );
  }

  return init as CreateEventInit;
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  if (value === null || typeof value !== 'object') {
    return false;
  }

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function describeValue(value: unknown): string {
  if (value == null) {
    return String(value);
  }

  if (Array.isArray(value)) {
    return 'an array';
  }

  if (typeof value === 'object') {
    return `an instance of ${value.constructor?.name ?? 'an unknown class'}`;
  }

  if (typeof value === 'function') {
    return 'a function';
  }

  return typeof value === 'string' ? `string "${value}"` : `${typeof value} ${String(value)}`;
}
