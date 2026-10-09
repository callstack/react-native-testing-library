import type { Config, Printer, Refs } from 'pretty-format';

import { isObject } from '../helpers/object';
import { EventEntry } from './events';

/**
 * Prints `createEventLogger()` entries with only the `nativeEvent` of event payloads, so
 * `userEvent` snapshots are the same with legacy event objects and modern `SyntheticEvent`s.
 * Other payloads, e.g. the text for `changeText`, are printed as they are.
 */
export function test(value: unknown): boolean {
  return value instanceof EventEntry;
}

export function serialize(
  entry: EventEntry,
  config: Config,
  indentation: string,
  depth: number,
  refs: Refs,
  printer: Printer,
): string {
  const { name, payload } = entry;
  const printedPayload =
    isObject(payload) && isObject(payload.nativeEvent)
      ? { nativeEvent: payload.nativeEvent }
      : payload;
  return printer({ name, payload: printedPayload }, config, indentation, depth, refs);
}
