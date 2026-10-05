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

const COMMON_DIRECT_EVENTS = ['layout', 'accessibilityAction'];
const TEXT_DIRECT_EVENTS = ['textLayout'];
const TEXT_INPUT_DIRECT_EVENTS = ['scroll', 'selectionChange', 'contentSizeChange'];
const IMAGE_DIRECT_EVENTS = ['loadStart', 'progress', 'load', 'error', 'loadEnd'];
const SCROLL_VIEW_DIRECT_EVENTS = [
  'scroll',
  'scrollBeginDrag',
  'scrollEndDrag',
  'momentumScrollBegin',
  'momentumScrollEnd',
  'refresh',
  'contentSizeChange',
];
const MODAL_DIRECT_EVENTS = ['requestClose', 'show', 'dismiss', 'orientationChange'];

/**
 * Direct events are delivered by React Native only to the host element that emitted them and do
 * not bubble. Whether an event is direct depends on the host element type, e.g. `load` is direct
 * for `Image` elements, while custom `onLoad` props of composite components still bubble.
 *
 * `fireEvent` still bubbles these events with a warning, until the next major version. See
 * `contributing/native-events.md`.
 */
function isDirectEvent(instance: TestInstance, eventName: string) {
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

  if (isHostModal(instance)) {
    return MODAL_DIRECT_EVENTS.includes(eventName);
  }

  return false;
}

export type FindEventHandlerOptions = {
  /** Only check the handler of the given element, e.g. for `fireEvent.layout`. */
  direct?: boolean;
};

type FindEventHandlerResult = {
  handler: EventHandler | null;
  /**
   * Elements whose handler was found but rejected by `isEventEnabled`, nearest to the fired
   * instance first. Lets callers tell "blocked handler" apart from "no handler at all".
   */
  skippedTargets: TestInstance[];
};

/**
 * Finds the handler that should receive the event, as `fireEvent` does: events bubble up the
 * tree until an enabled handler is found, unless `direct` option is set.
 *
 * Note: handlers are looked up by the event name as passed, while event rules (direct events,
 * `isEventEnabled`) use the name without the `on*` prefix.
 */
export function findEventHandler(
  instance: TestInstance,
  eventName: string,
  options?: FindEventHandlerOptions,
): FindEventHandlerResult {
  if (options?.direct) {
    const handler = getEventHandlerFromProps(instance.props, eventName, { loose: true });
    return { handler: handler ?? null, skippedTargets: [] };
  }

  const { owner, skippedTargets } = findBubblingHandlerOwner(instance, eventName, undefined, []);
  if (!owner) {
    return { handler: null, skippedTargets };
  }

  if (owner.instance !== instance && isDirectEvent(owner.instance, normalizeEventName(eventName))) {
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

  const handler =
    getEventHandlerFromProps(instance.props, eventName, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventName);
  if (handler) {
    if (isEventEnabled(instance, normalizeEventName(eventName), touchResponder)) {
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
