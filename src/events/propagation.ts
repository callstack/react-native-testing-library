import type { Fiber, TestInstance } from 'test-renderer';

import {
  isHostImage,
  isHostModal,
  isHostScrollView,
  isHostText,
  isHostTextInput,
} from '../helpers/host-component-names';
import { getEventHandlerFromProps, normalizeEventType } from './handler';
import { isEventEnabled, isTouchResponder } from './is-enabled';
import type { EventHandler } from './types';
import { warnAboutBubblingDirectEvent } from './warnings';

export type FindEventHandlerOptions = {
  /** When `false`, only checks the handler of the given element, e.g. for `fireEvent.layout`. */
  bubbles: boolean;
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
 * tree until an enabled handler is found, unless `bubbles` option is `false`.
 *
 * Note: handlers are looked up by the event type as passed, while event rules (direct events,
 * `isEventEnabled`) use the name without the `on*` prefix.
 */
export function findEventHandler(
  instance: TestInstance,
  eventType: string,
  options: FindEventHandlerOptions,
): FindEventHandlerResult {
  if (!options.bubbles) {
    const handler = getEventHandlerFromProps(instance.props, eventType, { loose: true });
    return { handler: handler ?? null, skippedTargets: [] };
  }

  const { owner, skippedTargets } = findBubblingHandlerOwner(instance, eventType, undefined, []);
  if (!owner) {
    return { handler: null, skippedTargets };
  }

  if (owner.instance !== instance && isDirectEvent(owner.instance, normalizeEventType(eventType))) {
    warnAboutBubblingDirectEvent(eventType, owner.instance);
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
  eventType: string,
  nearestTouchResponder: TestInstance | undefined,
  skippedTargets: TestInstance[],
): FindHandlerOwnerResult {
  const touchResponder = isTouchResponder(instance) ? instance : nearestTouchResponder;

  const handler =
    getEventHandlerFromProps(instance.props, eventType, { loose: true }) ??
    findEventHandlerFromFiber(instance.unstable_fiber, eventType);
  if (handler) {
    if (isEventEnabled(instance, normalizeEventType(eventType), touchResponder)) {
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

  return findBubblingHandlerOwner(instance.parent, eventType, touchResponder, skippedTargets);
}

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
function isDirectEvent(instance: TestInstance, eventType: string) {
  if (COMMON_DIRECT_EVENTS.includes(eventType)) {
    return true;
  }

  if (isHostText(instance)) {
    return TEXT_DIRECT_EVENTS.includes(eventType);
  }

  if (isHostTextInput(instance)) {
    return TEXT_INPUT_DIRECT_EVENTS.includes(eventType);
  }

  if (isHostImage(instance)) {
    return IMAGE_DIRECT_EVENTS.includes(eventType);
  }

  if (isHostScrollView(instance)) {
    return SCROLL_VIEW_DIRECT_EVENTS.includes(eventType);
  }

  if (isHostModal(instance)) {
    return MODAL_DIRECT_EVENTS.includes(eventType);
  }

  return false;
}

function findEventHandlerFromFiber(fiber: Fiber | null, eventType: string): EventHandler | null {
  // Container fibers have memoizedProps set to null
  if (!fiber?.memoizedProps) {
    return null;
  }

  const handler = getEventHandlerFromProps(fiber.memoizedProps, eventType, {
    loose: true,
  });
  if (handler) {
    return handler;
  }

  // No parent fiber or we reached another host element
  if (fiber.return === null || typeof fiber.return.type === 'string') {
    return null;
  }

  return findEventHandlerFromFiber(fiber.return, eventType);
}
