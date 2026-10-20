import type { TestInstance } from 'test-renderer';

import type { EventSystem } from '../config';
import { getConfig } from '../config';
import { fireEvent as legacyFireEvent } from './legacy/fire-event';
import type { CustomEventDispatch, KnownEventType } from './modern/event-types';
import type { FireEventInit } from './modern/fire-event';
import { fireEvent as modernFireEvent } from './modern/fire-event';
import { normalizeEventType } from './shared/handler';
import type { EventProps, EventType, LayoutRectangle } from './shared/types';
import { ensureAtMostOneEventArg, warnOnPrefix } from './utils';

/**
 * Settings that users augment to change RNTL's types. `@testing-library/react-native/modern-types`
 * sets `eventSystem: 'modern'`, so `fireEvent` takes the modern signatures.
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface Register {}

type RegisteredEventSystem = Register extends { eventSystem: infer S extends EventSystem }
  ? S
  : 'legacy';

type LegacyFireEvent = {
  (instance: TestInstance, eventType: EventType, ...data: unknown[]): Promise<unknown>;
  changeText: (instance: TestInstance, text: string) => Promise<unknown>;
  press: (instance: TestInstance, eventProps?: EventProps) => Promise<void>;
  scroll: (instance: TestInstance, eventProps?: EventProps) => Promise<void>;
  layout: (instance: TestInstance, layout?: Partial<LayoutRectangle>) => Promise<void>;
};

type KnownEventName = KnownEventType | `on${Capitalize<KnownEventType>}`;

type CustomFireEventInit = FireEventInit & { dispatch: CustomEventDispatch };

/** Shown in the type error of `fireEvent(input, 'changeText', 'Hello')`, as the runtime error. */
type ChangeTextHint = 'Use fireEvent.changeText() or userEvent.type() instead.';

/**
 * Event object that modern `fireEvent` accepts at runtime: optional for event types React Native
 * knows, and required with `dispatch` for the others. Not distributive, so a union with an unknown
 * event type requires it.
 */
type ModernFireEventArgs<T extends string> = [T] extends [KnownEventName]
  ? [event?: FireEventInit]
  : [T] extends ['changeText' | 'onChangeText']
    ? [event: ChangeTextHint | CustomFireEventInit]
    : [event: CustomFireEventInit];

type ModernFireEvent = {
  <T extends KnownEventName | (string & {})>(
    instance: TestInstance,
    eventType: T,
    ...args: ModernFireEventArgs<T>
  ): Promise<void>;
  changeText: (instance: TestInstance, text: string) => Promise<void>;
  press: (instance: TestInstance, event?: FireEventInit) => Promise<void>;
  scroll: (instance: TestInstance, event?: FireEventInit) => Promise<void>;
  layout: (instance: TestInstance, layout?: Partial<LayoutRectangle>) => Promise<void>;
};

export type FireEvent = RegisteredEventSystem extends 'modern' ? ModernFireEvent : LegacyFireEvent;

/**
 * Public `fireEvent`. Calls the implementation of the event system selected by
 * `configure({ unstable_eventSystem })`, read on each call, so `configure()` inside a test applies.
 *
 * Types follow the legacy signatures, or the modern ones when `Register` sets `eventSystem`. The
 * modern implementation also checks its arguments at runtime.
 */
async function fireEventImpl(
  instance: TestInstance,
  eventType: EventType,
  ...data: unknown[]
): Promise<unknown> {
  if (isModern()) {
    const normalizedType = normalizeEventType(eventType);
    ensureAtMostOneEventArg(normalizedType, data, fireEventImpl);
    // Before the dispatch, so the warning comes before handler output, even if a handler throws.
    warnOnPrefix(eventType);
    return await modernFireEvent(instance, normalizedType, data[0] as FireEventInit | undefined);
  }

  return await legacyFireEvent(instance, eventType, ...data);
}

fireEventImpl.changeText = async (instance: TestInstance, text: string): Promise<unknown> => {
  if (isModern()) {
    return await modernFireEvent.changeText(instance, text);
  }

  return await legacyFireEvent.changeText(instance, text);
};

fireEventImpl.press = async (instance: TestInstance, eventProps?: EventProps): Promise<void> => {
  if (isModern()) {
    await modernFireEvent.press(instance, eventProps as FireEventInit);
    return;
  }

  await legacyFireEvent.press(instance, eventProps);
};

fireEventImpl.scroll = async (instance: TestInstance, eventProps?: EventProps): Promise<void> => {
  if (isModern()) {
    await modernFireEvent.scroll(instance, eventProps as FireEventInit);
    return;
  }

  await legacyFireEvent.scroll(instance, eventProps);
};

fireEventImpl.layout = async (
  instance: TestInstance,
  layout?: Partial<LayoutRectangle>,
): Promise<void> => {
  if (isModern()) {
    await modernFireEvent.layout(instance, layout);
    return;
  }

  await legacyFireEvent.layout(instance, layout);
};

function isModern() {
  return getConfig().unstable_eventSystem === 'modern';
}

const fireEvent = fireEventImpl as FireEvent;

export { fireEvent };
