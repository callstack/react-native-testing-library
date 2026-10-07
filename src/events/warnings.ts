import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { getConfig } from '../config';
import { computeAriaDisabled } from '../helpers/accessibility';
import { formatElement, formatJson } from '../helpers/format-element';
import { logger } from '../helpers/logger';
import { normalizeEventName } from './handler';
import { getPointerEventsBlockerForEvent } from './is-enabled';
import { isDirectEvent } from './propagation';

type UnhandledEventInfo = {
  /** Elements whose handler was rejected by `isEventEnabled`, nearest first. */
  skippedTargets: TestInstance[];
  hasUpdatedNativeState: boolean;
};

export type EventWarning = {
  message: string;
  elements: TestInstance[];
  /** Elements whose `pointerEvents` blocked the event. Printed without their children. */
  pointerEventsBlockers?: TestInstance[];
};

/**
 * Warns when no handler ran because the target is disabled or nothing handles the event.
 * Enabled via `configure({ eventDiagnostics: true })`.
 */
export function warnAboutUnhandledEvent(
  instance: TestInstance,
  eventName: string,
  info: UnhandledEventInfo,
) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  const warning = getUnhandledEventWarning(instance, eventName, info);
  if (warning != null) {
    logEventWarning(warning);
  }
}

/**
 * Logs the warning with the opt-out hint, the elements it is about and what blocked them.
 */
export function logEventWarning({ message, elements, pointerEventsBlockers = [] }: EventWarning) {
  const header =
    `${message}\n` +
    'If this is intentional, you can disable this warning via `configure({ eventDiagnostics: false })`.';
  const elementBlocks = elements
    .map((element) => element.toJSON())
    .filter((json) => json != null)
    .map((json) => redent(formatJson(json), 2));
  // Blockers are often large containers, so they are printed without their children.
  const blockerBlocks = [...new Set(pointerEventsBlockers)].map((blocker) =>
    redent(formatElement(blocker, { highlight: false }), 2),
  );
  const blockerSection = blockerBlocks.length > 0 ? ['Blocked by:', ...blockerBlocks] : [];
  logger.warn([header, ...elementBlocks, ...blockerSection].join('\n\n'));
}

/**
 * Builds the warning for elements that `pointerEvents` blocked, or returns `null` if it
 * blocked none of them.
 *
 * @param targets Skipped elements, nearest first.
 * @param getBlocker Returns the element whose `pointerEvents` blocked the target, if any.
 * @param formatMessage Builds the message from the number of blocked elements.
 */
export function getPointerEventsWarning(
  targets: TestInstance[],
  getBlocker: (target: TestInstance) => TestInstance | null,
  formatMessage: (count: number) => string,
): EventWarning | null {
  const blocked = targets
    .map((target) => ({ target, blocker: getBlocker(target) }))
    .filter(
      (entry): entry is { target: TestInstance; blocker: TestInstance } => entry.blocker != null,
    );
  if (blocked.length === 0) {
    return null;
  }

  return {
    message: formatMessage(blocked.length),
    elements: blocked.map(({ target }) => target),
    pointerEventsBlockers: blocked.map(({ blocker }) => blocker),
  };
}

function getUnhandledEventWarning(
  instance: TestInstance,
  eventName: string,
  { skippedTargets, hasUpdatedNativeState }: UnhandledEventInfo,
): EventWarning | null {
  if (skippedTargets.length === 0) {
    // The event still had an effect, e.g. `changeText` on an uncontrolled TextInput updates its value.
    if (hasUpdatedNativeState) {
      return null;
    }

    if (isDirectEvent(normalizeEventName(eventName))) {
      return {
        message: `The element has no handler for the "${eventName}" event. "${eventName}" events do not bubble to ancestors.`,
        elements: [instance],
      };
    }

    return {
      message: `The element and its ancestors have no handler for the "${eventName}" event.`,
      elements: [instance],
    };
  }

  // `pointerEvents` is checked first: it blocks the event even if the element is enabled.
  const pointerEventsWarning = getPointerEventsWarning(
    skippedTargets,
    (target) => getPointerEventsBlockerForEvent(target, normalizeEventName(eventName)),
    (count) =>
      count === 1
        ? `Cannot fire the "${eventName}" event on an element blocked by pointerEvents.`
        : `Cannot fire the "${eventName}" event on elements blocked by pointerEvents.`,
  );
  if (pointerEventsWarning != null) {
    return pointerEventsWarning;
  }

  // `computeAriaDisabled` also covers non-editable `TextInput`. A responder declining the touch
  // is a deliberate way of blocking events, so it doesn't warn.
  const disabledTargets = skippedTargets.filter(computeAriaDisabled);
  if (disabledTargets.length === 0) {
    return null;
  }

  return {
    message:
      disabledTargets.length === 1
        ? `Cannot fire the "${eventName}" event on a disabled element.`
        : `Cannot fire the "${eventName}" event on disabled elements.`,
    elements: disabledTargets,
  };
}
