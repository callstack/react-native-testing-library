import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import type { NativeEventPayload } from './event';
import { eventInternals, SyntheticEvent } from './event';
import { getEventTypeConfig } from './event-types';

/**
 * Dispatches an event the way React Native dispatches events from native
 * (`src/private/renderer/events/dispatchNativeEvent.js`, then `dispatch()` in
 * `src/private/webapis/dom/events/EventTarget.js`):
 *
 * - Bubbling events run the capture phase from the root to the target (`on*Capture` props), then the
 *   bubble phase from the target to the root (`on*` props). Events with `skipBubbling` run the capture
 *   phase as usual, but the bubble phase calls only the target.
 * - Direct events call only the target's `on*` prop.
 * - Events unknown to React Native are dropped.
 *
 * Only host elements are on the event path, so props of composite components are never called.
 * Every handler on the path runs until one stops propagation. The first error thrown by a handler is
 * rethrown after the whole dispatch. The dispatch runs in a single `act()`, as React Native batches
 * updates for the whole event.
 *
 * Not implemented yet: responder negotiation, which React Native runs before the dispatch for touch,
 * scroll and selection change events.
 *
 * @param target host element that receives the event
 * @param eventType event type, e.g. `focus` or `pointerUp`
 * @param payload native event payload, passed to handlers as `event.nativeEvent`
 * @returns `false` if a handler called `preventDefault()`, `true` otherwise, as `dispatchEvent()`
 * of the DOM does.
 */
export async function dispatchEvent(
  target: TestInstance,
  eventType: string,
  payload: NativeEventPayload = {},
): Promise<boolean> {
  if (!isInstanceMounted(target)) {
    return true;
  }

  const event = createEvent(eventType, payload);
  if (event == null) {
    return true;
  }

  await act(() => {
    eventInternals.setIsTrusted(event, true);
    dispatch(target, event);
  });

  return !event.defaultPrevented;
}

function createEvent(eventType: string, payload: NativeEventPayload): SyntheticEvent | null {
  const config = getEventTypeConfig(eventType);
  if (config == null) {
    return null;
  }

  // React Native keeps the native timestamp as the event's `timeStamp`.
  const nativeTimeStamp = payload.timeStamp ?? payload.timestamp;
  return new SyntheticEvent(
    // React Native's event type is the lowercased name, e.g. `pointerup`.
    eventType.toLowerCase(),
    {
      bubbles: config.kind === 'bubbling' && !config.skipBubbling,
      cancelable: true,
      rnIsDirect: config.kind === 'direct',
      timeStamp: typeof nativeTimeStamp === 'number' ? nativeTimeStamp : undefined,
    },
    payload,
    config.dispatchConfig,
  );
}

type ErrorState = { hasError: boolean; error: unknown };

function dispatch(target: TestInstance, event: SyntheticEvent) {
  const path = getEventPath(target, event);
  eventInternals.setComposedPath(event, path);
  eventInternals.setTarget(event, target);

  const errorState: ErrorState = { hasError: false, error: undefined };

  for (let i = path.length - 1; i >= 0; i -= 1) {
    if (eventInternals.getStopPropagationFlag(event)) {
      break;
    }

    const node = path[i];
    eventInternals.setEventPhase(
      event,
      node === target ? SyntheticEvent.AT_TARGET : SyntheticEvent.CAPTURING_PHASE,
    );
    invoke(node, event, true, errorState);
  }

  for (const node of path) {
    if (eventInternals.getStopPropagationFlag(event)) {
      break;
    }

    // Events that don't bubble call only the target in the bubble phase.
    if (!event.bubbles && node !== target) {
      break;
    }

    eventInternals.setEventPhase(
      event,
      node === target ? SyntheticEvent.AT_TARGET : SyntheticEvent.BUBBLING_PHASE,
    );
    invoke(node, event, false, errorState);
  }

  eventInternals.setEventPhase(event, SyntheticEvent.NONE);
  eventInternals.setCurrentTarget(event, null);
  eventInternals.setComposedPath(event, []);
  eventInternals.resetStopPropagationFlag(event);

  if (errorState.hasError) {
    throw errorState.error;
  }
}

/**
 * Returns the target followed by its host ancestors. The root container is not an element, so it is
 * not on the path. Direct events have only the target on the path.
 */
function getEventPath(target: TestInstance, event: SyntheticEvent): TestInstance[] {
  if (event.rnIsDirect) {
    return [target];
  }

  const path: TestInstance[] = [];
  let current: TestInstance | null = target;
  while (current?.parent != null) {
    path.push(current);
    current = current.parent;
  }

  return path;
}

function invoke(
  node: TestInstance,
  event: SyntheticEvent,
  isCapture: boolean,
  errorState: ErrorState,
) {
  eventInternals.setCurrentTarget(event, node);

  const propName = getPropName(event, isCapture);
  const handler = propName != null ? node.props[propName] : undefined;
  if (typeof handler !== 'function') {
    return;
  }

  try {
    handler.call(node, event);
  } catch (error) {
    if (!errorState.hasError) {
      errorState.hasError = true;
      errorState.error = error;
    }
  }
}

function getPropName(event: SyntheticEvent, isCapture: boolean): string | null {
  const config = event.dispatchConfig;
  if (config == null) {
    return null;
  }

  if ('registrationName' in config) {
    return isCapture ? null : config.registrationName;
  }

  return isCapture
    ? config.phasedRegistrationNames.captured
    : config.phasedRegistrationNames.bubbled;
}
