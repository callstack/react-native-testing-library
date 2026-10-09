import type { TestInstance } from 'test-renderer';

import { isInstanceMounted } from '../../helpers/component-tree';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostScrollView } from '../../helpers/host-component-names';
import { normalizeEventType } from '../shared/handler';
import { mergeEventProps } from '../shared/merge';
import { nativeState } from '../shared/native-state';
import { buildLayoutNativeEvent, buildScrollNativeEvent } from '../shared/payloads';
import type { LayoutRectangle } from '../shared/types';
import { updateNativeStateFromEvent } from '../shared/update-native-state';
import { dispatchEvent } from './dispatch';
import type { CreateEventInit } from './event';
import { createEvent } from './event';
import { ensureEventType, validateEventInit } from './fire-event-utils';

/**
 * Event object passed to modern `fireEvent`. Handlers receive a `SyntheticEvent` from
 * `createEvent()`, with `nativeEvent` as its `nativeEvent`.
 */
export type FireEventInit = CreateEventInit;

/**
 * Fires an event on a host element: `createEvent()`, then `dispatchEvent()`, like Testing Library's
 * DOM `fireEvent(element, event)`. The event type is needed to find the event's dispatch config.
 *
 * Exactly one event object is required, as React Native handlers receive a single event. Event
 * types React Native doesn't dispatch natively (`changeText`, custom prop names) throw.
 *
 * @param eventType with or without the `on*` prefix, e.g. `focus` or `onFocus`
 * @returns `false` if a handler called `preventDefault()`, otherwise `true`.
 */
export async function fireEvent(
  instance: TestInstance,
  eventType: string,
  ...args: [event: FireEventInit]
): Promise<boolean> {
  const normalizedType = normalizeEventType(eventType);
  ensureInstance(instance, normalizedType, fireEvent);
  // Before the event object, as `fireEvent(input, 'changeText', 'Hello')` needs the hint more.
  ensureEventType(normalizedType, fireEvent);
  const init = validateEventInit(normalizedType, args, fireEvent);
  return await fireEventInternal(instance, normalizedType, init);
}

/**
 * Fires a `scroll` event. The passed `nativeEvent` is deep merged onto a default scroll payload,
 * whose `layoutMeasurement` is the `ScrollView`'s size from its last `layout` event.
 */
fireEvent.scroll = async (
  instance: TestInstance,
  ...args: [event?: FireEventInit]
): Promise<boolean> => {
  ensureInstance(instance, 'scroll', fireEvent.scroll);
  const init = validateEventInit('scroll', args.length > 0 ? args : [{}], fireEvent.scroll);
  const layoutMeasurement = isHostScrollView(instance)
    ? nativeState.layoutSizeForInstance.get(instance)
    : undefined;
  const nativeEvent = buildScrollNativeEvent(undefined, { layoutMeasurement });
  return await fireEventInternal(instance, 'scroll', {
    ...init,
    nativeEvent: mergeEventProps(nativeEvent, init.nativeEvent),
  });
};

/** Fires a `layout` event. The passed `layout` is merged onto a zeroed rectangle. */
fireEvent.layout = async (
  instance: TestInstance,
  layout?: Partial<LayoutRectangle>,
): Promise<boolean> => {
  ensureInstance(instance, 'layout', fireEvent.layout);
  return await fireEventInternal(instance, 'layout', {
    nativeEvent: buildLayoutNativeEvent(layout),
  });
};

/** Expects an event type React Native dispatches natively, without the `on*` prefix. */
async function fireEventInternal(
  instance: TestInstance,
  eventType: string,
  init: CreateEventInit,
): Promise<boolean> {
  const event = createEvent(eventType, init);
  if (event == null) {
    return true;
  }

  // Before the dispatch, as a device updates its native views before emitting the event.
  if (isInstanceMounted(instance)) {
    updateNativeStateFromEvent(instance, eventType, event);
  }

  await dispatchEvent(instance, event);
  return !event.defaultPrevented;
}

function ensureInstance(
  instance: TestInstance,
  eventType: string,
  // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
  callsite: Function,
) {
  if (instance == null) {
    throw new ErrorWithStack(
      `Unable to fire a "${eventType}" event - please provide a host element.`,
      callsite,
    );
  }
}
