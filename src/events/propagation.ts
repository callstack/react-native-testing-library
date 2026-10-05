import type { Fiber, TestInstance } from 'test-renderer';

import { getEventHandlerFromProps, normalizeEventName } from './handler';
import { isEventEnabled, isTouchResponder } from './is-enabled';
import type { EventHandler } from './types';

/**
 * Direct events are delivered by React Native only to the emitting element and do not bubble.
 */
export function isDirectEvent(eventName: string) {
  return eventName === 'layout';
}

export type FindEventHandlerResult = {
  handler: EventHandler | null;
  /**
   * Nearest element (to the fired instance) whose handler was found but rejected by
   * `isEventEnabled`. Lets callers tell "blocked handler" apart from "no handler at all".
   */
  rejectedTarget: TestInstance | null;
};

/**
 * Finds the handler that should receive the event, as `fireEvent` does: direct events only
 * check the target, other events bubble up the tree until an enabled handler is found.
 *
 * Note: handlers are looked up by the event name as passed, while event rules (direct events,
 * `isEventEnabled`) use the name without the `on*` prefix.
 */
export function findEventHandler(
  instance: TestInstance,
  eventName: string,
): FindEventHandlerResult {
  if (isDirectEvent(normalizeEventName(eventName))) {
    const handler = getEventHandlerFromProps(instance.props, eventName, { loose: true });
    return { handler: handler ?? null, rejectedTarget: null };
  }

  return findBubblingEventHandler(instance, eventName, undefined, null);
}

function findBubblingEventHandler(
  instance: TestInstance,
  eventName: string,
  nearestTouchResponder: TestInstance | undefined,
  rejectedTarget: TestInstance | null,
): FindEventHandlerResult {
  const touchResponder = isTouchResponder(instance) ? instance : nearestTouchResponder;

  const handler =
    getEventHandlerFromProps(instance.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventName);

  if (handler) {
    if (isEventEnabled(instance, normalizeEventName(eventName), touchResponder)) {
      return { handler, rejectedTarget: null };
    }

    // Keep only the first (nearest to the fired instance) rejection.
    rejectedTarget ??= touchResponder ?? instance;
  }

  if (instance.parent === null) {
    return { handler: null, rejectedTarget };
  }

  return findBubblingEventHandler(instance.parent, eventName, touchResponder, rejectedTarget);
}

function findEventHandlerFromFiber(fiber: Fiber | null, eventName: string): EventHandler | null {
  // Container fibers have memoizedProps set to null
  if (!fiber?.memoizedProps) {
    return null;
  }

  const handler = getEventHandlerFromProps(fiber.memoizedProps, eventName, {
    loose: true,
  });
  if (handler) {
    return handler;
  }

  // No parent fiber or we reached another host element
  if (fiber.return === null || typeof fiber.return.type === 'string') {
    return null;
  }

  return findEventHandlerFromFiber(fiber.return, eventName);
}
