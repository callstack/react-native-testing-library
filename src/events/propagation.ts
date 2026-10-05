import type { Fiber, TestInstance } from 'test-renderer';

import { formatElement } from '../helpers/format-element';
import {
  isHostImage,
  isHostModal,
  isHostScrollView,
  isHostText,
  isHostTextInput,
} from '../helpers/host-component-names';
import { logger } from '../helpers/logger';
import { getEventHandlerFromProps, normalizeEventName } from './handler';
import { isEventEnabled, isTouchResponder } from './is-enabled';
import type { EventHandler } from './types';

/** Intentionally incomplete, see `*_DEPRECATED_BUBBLING_EVENTS` below. */
const COMMON_DIRECT_EVENTS = ['layout'];
const TEXT_DIRECT_EVENTS = ['textLayout'];
const TEXT_INPUT_DIRECT_EVENTS = ['selectionChange', 'contentSizeChange'];
const IMAGE_DIRECT_EVENTS = ['loadStart', 'progress', 'load', 'error', 'loadEnd'];
const SCROLL_VIEW_DIRECT_EVENTS = [
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
];

/**
 * Direct events are delivered by React Native only to the host element that emitted them and do
 * not bubble. Whether an event is direct depends on the host element type, e.g. `load` is direct
 * for `Image` elements, while custom `onLoad` props of composite components still bubble.
 */
export function isDirectEvent(instance: TestInstance, eventName: string) {
  if (COMMON_DIRECT_EVENTS.includes(eventName)) {
    return true;
  }

  if (isHostText(instance)) {
    return TEXT_DIRECT_EVENTS.includes(eventName);
  }

  if (isHostTextInput(instance)) {
    return TEXT_INPUT_DIRECT_EVENTS.includes(eventName);
  }

  if (isHostImage(instance)) {
    return IMAGE_DIRECT_EVENTS.includes(eventName);
  }

  if (isHostScrollView(instance)) {
    return SCROLL_VIEW_DIRECT_EVENTS.includes(eventName);
  }

  return false;
}

/**
 * Direct in React Native, but still bubble with a deprecation warning for backward compatibility.
 * Make them direct in the next major version. See `contributing/native-events.md`.
 */
const COMMON_DEPRECATED_BUBBLING_EVENTS = ['accessibilityAction'];
const TEXT_INPUT_DEPRECATED_BUBBLING_EVENTS = ['scroll'];
const SCROLL_VIEW_DEPRECATED_BUBBLING_EVENTS = ['scroll', 'refresh', 'contentSizeChange'];
const MODAL_DEPRECATED_BUBBLING_EVENTS = ['requestClose', 'show', 'dismiss', 'orientationChange'];

function isDeprecatedBubblingEvent(instance: TestInstance, eventName: string) {
  if (COMMON_DEPRECATED_BUBBLING_EVENTS.includes(eventName)) {
    return true;
  }

  if (isHostTextInput(instance)) {
    return TEXT_INPUT_DEPRECATED_BUBBLING_EVENTS.includes(eventName);
  }

  if (isHostScrollView(instance)) {
    return SCROLL_VIEW_DEPRECATED_BUBBLING_EVENTS.includes(eventName);
  }

  if (isHostModal(instance)) {
    return MODAL_DEPRECATED_BUBBLING_EVENTS.includes(eventName);
  }

  return false;
}

type FindEventHandlerResult = {
  handler: EventHandler | null;
  /**
   * Elements whose handler was found but rejected by `isEventEnabled`, nearest to the fired
   * instance first. Lets callers tell "blocked handler" apart from "no handler at all".
   */
  skippedTargets: TestInstance[];
};

/**
 * Finds the handler that should receive the event, as `fireEvent` does: direct events only
 * check the target, other events bubble up the tree until an enabled handler is found. Bubbling
 * stops at an ancestor that emits the event as direct, as such events never come from children.
 *
 * Note: handlers are looked up by the event name as passed, while event rules (direct events,
 * `isEventEnabled`) use the name without the `on*` prefix.
 */
export function findEventHandler(
  instance: TestInstance,
  eventName: string,
): FindEventHandlerResult {
  const normalizedEventName = normalizeEventName(eventName);
  if (isDirectEvent(instance, normalizedEventName)) {
    const handler = getEventHandlerFromProps(instance.props, eventName, { loose: true });
    return { handler: handler ?? null, skippedTargets: [] };
  }

  const { owner, skippedTargets } = findBubblingHandlerOwner(instance, eventName, undefined, []);
  if (!owner) {
    return { handler: null, skippedTargets };
  }

  // React Native delivers these events only to elements that emit them, never from children.
  if (
    owner.instance !== instance &&
    isDeprecatedBubblingEvent(owner.instance, normalizedEventName)
  ) {
    logger.warn(
      `fireEvent: "${eventName}" event bubbled to the handler of an ancestor element. React Native does not bubble this event, and fireEvent will stop bubbling it in the next major version. Fire it on the element that has the handler instead.`,
      formatElement(owner.instance),
    );
  }

  return { handler: owner.handler, skippedTargets };
}

type HandlerOwner = {
  handler: EventHandler;
  instance: TestInstance;
};

type FindHandlerOwnerResult = {
  owner: HandlerOwner | null;
  skippedTargets: TestInstance[];
};

function findBubblingHandlerOwner(
  instance: TestInstance,
  eventName: string,
  nearestTouchResponder: TestInstance | undefined,
  skippedTargets: TestInstance[],
): FindHandlerOwnerResult {
  const touchResponder = isTouchResponder(instance) ? instance : nearestTouchResponder;
  const normalizedEventName = normalizeEventName(eventName);

  const handler =
    getEventHandlerFromProps(instance.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventName);

  if (isDirectEvent(instance, normalizedEventName)) {
    if (handler) {
      logger.warn(
        `fireEvent: "${eventName}" event does not bubble, fire it on the element that has the handler instead.`,
        formatElement(instance),
      );
    }

    return { owner: null, skippedTargets };
  }

  if (handler) {
    if (isEventEnabled(instance, normalizedEventName, touchResponder)) {
      return { owner: { handler, instance }, skippedTargets };
    }

    // Handlers on the same touch responder report it only once.
    const skippedTarget = touchResponder ?? instance;
    if (!skippedTargets.includes(skippedTarget)) {
      skippedTargets.push(skippedTarget);
    }
  }

  if (instance.parent === null) {
    return { owner: null, skippedTargets };
  }

  return findBubblingHandlerOwner(instance.parent, eventName, touchResponder, skippedTargets);
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
