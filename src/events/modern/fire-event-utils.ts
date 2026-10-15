import type { TestInstance } from 'test-renderer';

import { ErrorWithStack } from '../../helpers/errors';
import { isHostTextInput } from '../../helpers/host-component-names';
import { logger } from '../../helpers/logger';
import { hasOnPrefix, normalizeEventType } from '../shared/handler';
import type { CreateEventInit } from './event';
import { SyntheticEvent } from './event';
import {
  CUSTOM_EVENT_DISPATCHES,
  getEventTypeConfig,
  isPressabilityEventType,
} from './event-types';

const ALLOWED_INIT_KEYS = ['nativeEvent', 'timeStamp', 'dispatch'];

const EVENT_KEYS = new Set(
  Object.getOwnPropertyNames(SyntheticEvent.prototype).filter((key) => key !== 'constructor'),
);

/** What to use instead of event types that only the legacy system or `userEvent` can fire. */
const UNKNOWN_EVENT_TYPE_ALTERNATIVES: Record<string, string> = {
  changeText: 'fireEvent.changeText() or userEvent.type()',
};

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

/**
 * Throws for event types React Native doesn't know, such as `changeText` or custom prop names,
 * except Pressability event types (`pressIn`, ...), and event types passed with `dispatch`.
 * React Native drops unknown events, so dropping them here would call no handler, and a test
 * asserting that a handler wasn't called would pass for the wrong reason.
 *
 * `dispatch` is required, not defaulted to `direct`: a legacy call such as
 * `fireEvent(list, 'endReached', ...)` would otherwise pass a `SyntheticEvent` to `onEndReached`,
 * which `FlatList` calls from JavaScript, but the Jest mock of `ScrollView` puts on the host.
 *
 * @param init the event object, checked by `validateEventInit()` afterwards
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function ensureEventType(
  eventType: string,
  init: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): void {
  if (isKnownEventType(eventType)) {
    return;
  }

  // Custom event type: the caller declares how it dispatches.
  if (isPlainObject(init) && init.dispatch !== undefined) {
    return;
  }

  const alternative = UNKNOWN_EVENT_TYPE_ALTERNATIVES[eventType];
  if (alternative != null) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. React Native doesn't dispatch "${eventType}" ` +
        `natively. Use ${alternative} instead.`,
      callsite,
    );
  }

  throw new ErrorWithStack(
    `Unable to fire a "${eventType}" event. React Native doesn't know "${eventType}". ` +
      `For a native event of a third-party component, pass dispatch: "direct" or "bubbling" ` +
      'in the event object, matching its DirectEventHandler or BubblingEventHandler prop type. ' +
      'To call a handler prop directly, use UNSAFE_invokeHandler().',
    callsite,
  );
}

/**
 * Throws unless exactly one argument follows the event type in modern `fireEvent`, as React Native
 * handlers receive a single event. Catches legacy calls passing several handler arguments.
 *
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function ensureSingleEventArg(
  eventType: string,
  args: unknown[],
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): void {
  if (args.length === 0) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Please provide an event object, ` +
        `e.g. fireEvent(element, '${eventType}', { nativeEvent: {} }).`,
      callsite,
    );
  }

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
 * @param callsite the function to remove from the error stack, e.g. `fireEvent`
 */
export function validateEventInit(
  eventType: string,
  init: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): CreateEventInit {
  if (!isPlainObject(init)) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Expected an event object, ` +
        `received ${describeValue(init)}.`,
      callsite,
    );
  }

  const unknownKeys = Object.keys(init).filter((key) => !ALLOWED_INIT_KEYS.includes(key));
  if (unknownKeys.length > 0) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Unsupported event object keys: ` +
        `${formatKeys(unknownKeys)}. ${describeUnknownKeys(unknownKeys)}`,
      callsite,
    );
  }

  if (init.nativeEvent !== undefined && !isPlainObject(init.nativeEvent)) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Expected "nativeEvent" to be an object, ` +
        `received ${describeValue(init.nativeEvent)}.`,
      callsite,
    );
  }

  if (
    init.timeStamp !== undefined &&
    (typeof init.timeStamp !== 'number' || !Number.isFinite(init.timeStamp))
  ) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Expected "timeStamp" to be a finite number, ` +
        `received ${describeValue(init.timeStamp)}.`,
      callsite,
    );
  }

  if (
    init.dispatch !== undefined &&
    !(CUSTOM_EVENT_DISPATCHES as readonly unknown[]).includes(init.dispatch)
  ) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event. Expected "dispatch" to be "direct" or "bubbling", ` +
        `received ${describeValue(init.dispatch)}.`,
      callsite,
    );
  }

  return init as CreateEventInit;
}

/**
 * Validates the arguments of `fireEvent.changeText`: a host `TextInput`, as only `TextInput` calls
 * `onChangeText`, and a string.
 *
 * @param callsite the function to remove from the error stack, e.g. `fireEvent.changeText`
 */
export function validateChangeTextArgs(
  instance: TestInstance,
  text: unknown,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
): asserts text is string {
  if (!isHostTextInput(instance)) {
    throw new ErrorWithStack(
      `Unable to fire a "changeText" event. Expected a host "TextInput" element, ` +
        `received "${instance.type}".`,
      callsite,
    );
  }

  if (typeof text !== 'string') {
    throw new ErrorWithStack(
      `Unable to fire a "changeText" event. Expected text to be a string, ` +
        `received ${describeValue(text)}.`,
      callsite,
    );
  }
}

function isKnownEventType(eventType: string): boolean {
  return getEventTypeConfig(eventType) != null || isPressabilityEventType(eventType);
}

/**
 * Explains why each key can't be passed. Dropping keys silently, as DOM event constructors do,
 * would leave handlers reading `undefined` with no explanation.
 */
function describeUnknownKeys(keys: string[]): string {
  const eventKeys = keys.filter((key) => EVENT_KEYS.has(key));
  const otherKeys = keys.filter((key) => !EVENT_KEYS.has(key));

  const reasons: string[] = [];
  if (eventKeys.length > 0) {
    reasons.push(`${formatKeys(eventKeys)} ${isOrAre(eventKeys)} provided by the event.`);
  }

  if (otherKeys.length > 0) {
    reasons.push(`Pass ${formatKeys(otherKeys)} in "nativeEvent" instead.`);
  }

  return reasons.join(' ');
}

function formatKeys(keys: string[]): string {
  return keys.map((key) => `"${key}"`).join(', ');
}

function isOrAre(keys: string[]): string {
  return keys.length === 1 ? 'is' : 'are';
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
