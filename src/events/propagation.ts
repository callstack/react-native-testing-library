import type { Fiber, TestInstance } from 'test-renderer';

import { formatElement } from '../helpers/format-element';
import { logger } from '../helpers/logger';
import type { EventHandler } from './handler';
import { getEventHandlerFromProps } from './handler';
import { isEventEnabled, isTouchResponder } from './is-enabled';

/**
 * Direct events are delivered by React Native only to the emitting element and do not bubble.
 * Note: `fireEvent` accepts both `layout` and `onLayout` event names, so check both forms.
 */
export function isDirectEvent(eventName: string) {
  return eventName === 'layout' || eventName === 'onLayout';
}

/**
 * Finds the handler that should receive the event, as `fireEvent` does: direct events only
 * check the target, other events bubble up the tree until an enabled handler is found.
 */
export function findEventHandler(instance: TestInstance, eventName: string): EventHandler | null {
  return isDirectEvent(eventName)
    ? getOwnEventHandler(instance, eventName)
    : findBubblingEventHandler(instance, eventName);
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
  nearestTouchResponder?: TestInstance,
): EventHandler | null {
  const touchResponder = isTouchResponder(instance) ? instance : nearestTouchResponder;

  const handler =
    getEventHandlerFromProps(instance.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventName);
  if (handler && isEventEnabled(instance, eventName, touchResponder)) {
    return handler;
  }

  if (instance.parent === null) {
    return null;
  }

  return findBubblingEventHandler(instance.parent, eventName, touchResponder);
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
