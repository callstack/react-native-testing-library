import type { TestInstance } from 'test-renderer';

import { act } from '../../act';
import { isInstanceMounted } from '../../helpers/component-tree';
import { getEventHandlerByName } from '../shared/handler';
import type { EventPhase } from './event';
import { getEventInternals, SyntheticEvent } from './event';
import type { BubblingEventTypeConfig, DirectEventTypeConfig } from './event-types';

/**
 * Dispatches an event from `createEvent()` as React Native does for native events
 * (`src/private/renderer/events/dispatchNativeEvent.js`, then `dispatch()` in
 * `src/private/webapis/dom/events/EventTarget.js`):
 *
 * - Direct events: only the target's `on*` prop. See `dispatchDirectEvent()`.
 * - Bubbling events: capture phase from the root to the target (`on*Capture`), then bubble phase
 *   back to the root (`on*`). See `dispatchBubblingEvent()`.
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
export async function dispatchEvent(
  target: TestInstance,
  event: SyntheticEvent,
  options?: DispatchOptions,
): Promise<boolean> {
  if (!isInstanceMounted(target)) {
    return false;
  }

  const config = getEventInternals(event).typeConfig;
  const state: DispatchState = { hasCalledHandler: false, firstError: null };

  await act(() => {
    getEventInternals(event).isTrusted = true;
    getEventInternals(event).target = target;
    if (config.kind === 'direct') {
      dispatchDirectEvent(event, target, config, state, options?.afterTargetHandler);
    } else {
      dispatchBubblingEvent(event, target, config, state, options?.afterTargetHandler);
    }

    resetEvent(event);
  });

  // After `act()`, which would skip rendering other handlers' updates if its callback threw.
  if (state.firstError != null) {
    throw state.firstError.error;
  }

  return state.hasCalledHandler;
}

export type DispatchOptions = {
  /**
   * Runs at the target, right after the target's own handler, like a composite component wrapping
   * the host prop: `TextInput` passes `onChange={_onChange}`, which calls `props.onChange(event)`,
   * then `props.onChangeText(text)`. Skipped when propagation stopped before the target, or when
   * the target's handler threw. Runs when the target has no handler.
   */
  afterTargetHandler?: (target: TestInstance, event: SyntheticEvent) => void;
};

/** Clears the event's internals, as the event can still be read after the dispatch. */
function resetEvent(event: SyntheticEvent) {
  getEventInternals(event).eventPhase = SyntheticEvent.NONE;
  getEventInternals(event).currentTarget = null;
  getEventInternals(event).composedPath = [];
  getEventInternals(event).stopPropagation = false;
}

type DispatchState = {
  hasCalledHandler: boolean;
  /** Wrapped, so a thrown `undefined` is rethrown too. */
  firstError: { error: unknown } | null;
};

/** Calls only the target's handler: no capture phase, no ancestors. */
function dispatchDirectEvent(
  event: SyntheticEvent,
  target: TestInstance,
  config: DirectEventTypeConfig,
  state: DispatchState,
  afterTargetHandler: DispatchOptions['afterTargetHandler'],
) {
  getEventInternals(event).composedPath = [target];
  callHandler(
    event,
    target,
    config.handlerName,
    SyntheticEvent.AT_TARGET,
    state,
    afterTargetHandler,
  );
}

/**
 * Capture phase from the root down to the target, then bubble phase from the target back up to the
 * root. `skipBubbling` events (`pointerEnter`, `pointerLeave`) run the full capture phase, but
 * stop the bubble phase at the target.
 */
function dispatchBubblingEvent(
  event: SyntheticEvent,
  target: TestInstance,
  config: BubblingEventTypeConfig,
  state: DispatchState,
  afterTargetHandler: DispatchOptions['afterTargetHandler'],
) {
  const path = getAncestorPath(target);
  getEventInternals(event).composedPath = path;

  // Capture: root first, target last.
  for (let i = path.length - 1; i >= 0 && !event.isPropagationStopped(); i -= 1) {
    const phase = i === 0 ? SyntheticEvent.AT_TARGET : SyntheticEvent.CAPTURING_PHASE;
    callHandler(event, path[i], config.captureHandlerName, phase, state);
  }

  // Bubble: target first, root last.
  const bubblePath = config.skipBubbling ? [target] : path;
  for (let i = 0; i < bubblePath.length && !event.isPropagationStopped(); i += 1) {
    const isTarget = i === 0;
    callHandler(
      event,
      bubblePath[i],
      config.handlerName,
      isTarget ? SyntheticEvent.AT_TARGET : SyntheticEvent.BUBBLING_PHASE,
      state,
      isTarget ? afterTargetHandler : undefined,
    );
  }
}

/** Target first, then host ancestors. The root container is not an element, so it's excluded. */
export function getAncestorPath(target: TestInstance): TestInstance[] {
  const path: TestInstance[] = [];
  let current: TestInstance | null = target;
  while (current?.parent != null) {
    path.push(current);
    current = current.parent;
  }

  return path;
}

function callHandler(
  event: SyntheticEvent,
  node: TestInstance,
  handlerName: string,
  phase: EventPhase,
  state: DispatchState,
  afterHandler?: DispatchOptions['afterTargetHandler'],
) {
  getEventInternals(event).eventPhase = phase;
  getEventInternals(event).currentTarget = node;

  const handler = getEventHandlerByName(node.props, handlerName);
  if (handler == null && afterHandler == null) {
    return;
  }

  try {
    if (handler != null) {
      state.hasCalledHandler = true;
      handler.call(node, event);
    }

    // In the same `try`, as a component's wrapper doesn't reach its own code after the prop throws.
    afterHandler?.(node, event);
  } catch (error) {
    // Keep dispatching, as React Native (`handleListenerError()` in `EventTarget.js`) and DOM do.
    if (state.firstError == null) {
      state.firstError = { error };
    }
  }
}
