import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { getHandlerProp } from '../shared/handler';
import { eventInternals, SyntheticEvent } from './event';

/**
 * Dispatches an event from `createEvent()` as React Native does for native events
 * (`src/private/renderer/events/dispatchNativeEvent.js`, then `dispatch()` in
 * `src/private/webapis/dom/events/EventTarget.js`):
 *
 * - Bubbling events: capture phase from the root to the target (`on*Capture`), then bubble phase
 *   back to the root (`on*`). `skipBubbling` events call only the target when bubbling.
 * - Direct events: only the target's `on*` prop.
 *
 * Only host elements are on the path, so composite props are never called. Every handler on the
 * path runs until one stops propagation. The first handler error is rethrown after all handlers
 * ran. One `act()` wraps the dispatch, as React Native batches updates for the whole event.
 *
 * Not implemented yet: responder negotiation, which React Native runs first for touch, scroll and
 * selection change events.
 *
 * @returns `false` if a handler called `preventDefault()`, like DOM `dispatchEvent()`.
 */
export async function dispatchEvent(target: TestInstance, event: SyntheticEvent): Promise<boolean> {
  if (!isInstanceMounted(target)) {
    return true;
  }

  await act(() => {
    dispatch(target, event);
  });

  return !event.defaultPrevented;
}

type ErrorState = { hasError: boolean; error: unknown };

function dispatch(target: TestInstance, event: SyntheticEvent) {
  const path = getEventPath(target, event);
  eventInternals.setComposedPath(event, path);
  eventInternals.setTarget(event, target);

  const errorState: ErrorState = { hasError: false, error: undefined };

  for (let i = path.length - 1; i >= 0; i -= 1) {
    if (event.isPropagationStopped()) {
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
    if (event.isPropagationStopped()) {
      break;
    }

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

/** Target first, then host ancestors. The root container is not an element, so it's excluded. */
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
  const handler = propName != null ? getHandlerProp(node.props, propName) : undefined;
  if (handler == null) {
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
  if ('registrationName' in config) {
    return isCapture ? null : config.registrationName;
  }

  return isCapture
    ? config.phasedRegistrationNames.captured
    : config.phasedRegistrationNames.bubbled;
}
