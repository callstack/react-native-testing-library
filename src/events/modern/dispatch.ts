import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { getHandlerByName } from '../shared/handler';
import type { EventPhase } from './event';
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
 * Only host elements are on the path, so composite props are never called. A `testOnly_` prop
 * (`testOnly_onFocus`) is used when the element has no regular one. Every handler on the
 * path runs until one stops propagation. The first handler error is rethrown after all handlers
 * ran. One `act()` wraps the dispatch, as React Native batches updates for the whole event.
 *
 * Not implemented yet: responder negotiation, which React Native runs first for touch, scroll and
 * selection change events.
 *
 * @returns `true` if a handler was called. Check `event.defaultPrevented` for `preventDefault()`.
 */
export async function dispatchEvent(target: TestInstance, event: SyntheticEvent): Promise<boolean> {
  if (!isInstanceMounted(target)) {
    return false;
  }

  const path = getEventPath(target, event);
  const state: DispatchState = { hasCalledHandler: false, firstError: null };

  await act(() => {
    eventInternals.setTarget(event, target);
    eventInternals.setComposedPath(event, path);

    runCapturePhase(event, path, state);
    runBubblePhase(event, path, state);
    resetEvent(event);
  });

  // After `act()`, which would skip rendering other handlers' updates if its callback threw.
  if (state.firstError != null) {
    throw state.firstError.error;
  }

  return state.hasCalledHandler;
}

/** What the handlers did during one dispatch. */
type DispatchState = {
  hasCalledHandler: boolean;
  /** Wrapped, so a thrown `undefined` is rethrown too. */
  firstError: { error: unknown } | null;
};

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

/** From the root down to the target, calling `on*Capture` props. Direct events skip it. */
function runCapturePhase(event: SyntheticEvent, path: TestInstance[], state: DispatchState) {
  const handlerName = getCaptureHandlerName(event);
  if (handlerName == null) {
    return;
  }

  for (let i = path.length - 1; i >= 0 && !event.isPropagationStopped(); i -= 1) {
    const phase = i === 0 ? SyntheticEvent.AT_TARGET : SyntheticEvent.CAPTURING_PHASE;
    callHandler(event, path[i], handlerName, phase, state);
  }
}

/** From the target up to the root, calling `on*` props. Non-bubbling events stop at the target. */
function runBubblePhase(event: SyntheticEvent, path: TestInstance[], state: DispatchState) {
  const handlerName = getBubbleHandlerName(event);
  const nodes = event.bubbles ? path : path.slice(0, 1);
  for (let i = 0; i < nodes.length && !event.isPropagationStopped(); i += 1) {
    const phase = i === 0 ? SyntheticEvent.AT_TARGET : SyntheticEvent.BUBBLING_PHASE;
    callHandler(event, nodes[i], handlerName, phase, state);
  }
}

function callHandler(
  event: SyntheticEvent,
  node: TestInstance,
  handlerName: string,
  phase: EventPhase,
  state: DispatchState,
) {
  eventInternals.setEventPhase(event, phase);
  eventInternals.setCurrentTarget(event, node);

  const handler = getHandlerByName(node.props, handlerName);
  if (handler == null) {
    return;
  }

  state.hasCalledHandler = true;
  try {
    handler.call(node, event);
  } catch (error) {
    // Keep dispatching: one failing handler doesn't stop handlers on other elements, as in React
    // Native (`handleListenerError()` in `EventTarget.js`) and the DOM. `dispatchEvent()` rethrows
    // the first error once the whole dispatch is done.
    if (state.firstError == null) {
      state.firstError = { error };
    }
  }
}

/** Direct events have no capture phase. */
function getCaptureHandlerName(event: SyntheticEvent): string | null {
  const config = event.dispatchConfig;
  return 'registrationName' in config ? null : config.phasedRegistrationNames.captured;
}

function getBubbleHandlerName(event: SyntheticEvent): string {
  const config = event.dispatchConfig;
  return 'registrationName' in config
    ? config.registrationName
    : config.phasedRegistrationNames.bubbled;
}

/** Clears the event's internals, as the event can still be read after the dispatch. */
function resetEvent(event: SyntheticEvent) {
  eventInternals.setEventPhase(event, SyntheticEvent.NONE);
  eventInternals.setCurrentTarget(event, null);
  eventInternals.setComposedPath(event, []);
  eventInternals.resetStopPropagationFlag(event);
}
