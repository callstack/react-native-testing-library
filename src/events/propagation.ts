import type { Fiber, TestInstance } from 'test-renderer';

import { formatElement } from '../helpers/format-element';
import { logger } from '../helpers/logger';
import { getEventHandlerFromProps, normalizeEventName } from './handler';
import { isEventEnabled, isTouchResponder } from './is-enabled';
import type { EventHandler } from './types';

/**
 * Direct events are delivered by React Native only to the emitting element and do not bubble.
 */
export function isDirectEvent(eventName: string) {
  return eventName === 'layout';
}

// Carries state across the recursive `findEventHandler` walk. `rejectedTargetRef` is
// filled in with the element that owned the nearest handler rejected by `isEventEnabled`,
// so callers can report *why* no handler ran without re-walking the tree themselves.
export type FindEventHandlerContext = {
  nearestTouchResponder?: TestInstance;
  rejectedTargetRef: { current: TestInstance | null };
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
  context: FindEventHandlerContext,
): EventHandler | null {
  return isDirectEvent(normalizeEventName(eventName))
    ? getOwnEventHandler(instance, eventName)
    : findBubblingEventHandler(instance, eventName, context);
}

function getOwnEventHandler(instance: TestInstance, eventName: string): EventHandler | null {
  const handler = getEventHandlerFromProps(instance.props, eventName, { loose: true });
  if (!handler) {
    logger.warn(
      `fireEvent: element has no handler for "${eventName}" event.`,
      formatElement(instance),
    );
    return null;
  }

  return handler;
}

function findBubblingEventHandler(
  instance: TestInstance,
  eventName: string,
  context: FindEventHandlerContext,
): EventHandler | null {
  const touchResponder = isTouchResponder(instance) ? instance : context.nearestTouchResponder;

  const handler =
    getEventHandlerFromProps(instance.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventName);

  if (handler) {
    if (isEventEnabled(instance, normalizeEventName(eventName), touchResponder)) {
      return handler;
    }

    // Keep only the first (nearest to the fired instance) rejection.
    if (context.rejectedTargetRef.current == null) {
      context.rejectedTargetRef.current = touchResponder ?? instance;
    }
  }

  if (instance.parent === null) {
    return null;
  }

  return findBubblingEventHandler(instance.parent, eventName, {
    ...context,
    nearestTouchResponder: touchResponder,
  });
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
