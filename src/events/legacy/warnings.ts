import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { getConfig } from '../../config';
import { computeAriaDisabled } from '../../helpers/accessibility';
import { formatElement } from '../../helpers/format-element';
import { logger } from '../../helpers/logger';
import { getEventHandlerName, normalizeEventType } from '../shared/handler';
import type { EventWarning } from '../shared/warnings';
import {
  formatDisabledTargets,
  getPointerEventsBlockedTargets,
  logEventWarning,
} from '../shared/warnings';
import { isEventBlockableByPointerEvents } from './is-enabled';

type UnhandledEventInfo = {
  skippedTargets: TestInstance[];
  hasUpdatedNativeState: boolean;
};

/**
 * Warns when no handler ran because the target is disabled or nothing handles the event.
 */
export function warnAboutUnhandledEvent(
  instance: TestInstance,
  eventType: string,
  info: UnhandledEventInfo,
) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  const warning = getUnhandledEventWarning(instance, eventType, info);
  if (warning != null) {
    logEventWarning(warning);
  }
}

/**
 * Warns when `fireEvent` bubbles a direct event from the fired element up to `owner`. React Native
 * delivers direct events only to the emitting element, so the event should be fired on `owner`.
 */
export function warnAboutBubblingDirectEvent(eventType: string, owner: TestInstance) {
  logger.warn(
    `fireEvent: "${eventType}" does not bubble in React Native. fireEvent will stop bubbling it in the next major version. ` +
      `Fire it on:\n\n${redent(formatElement(owner), 2)}`,
  );
}

function getUnhandledEventWarning(
  instance: TestInstance,
  eventType: string,
  { skippedTargets, hasUpdatedNativeState }: UnhandledEventInfo,
): EventWarning | null {
  if (skippedTargets.length === 0) {
    // The event still had an effect, e.g. `changeText` on an uncontrolled TextInput updates its value.
    if (hasUpdatedNativeState) {
      return null;
    }

    const handlerName = getEventHandlerName(eventType);
    return {
      message: `No "${handlerName}" handler found on the element or its ancestors.`,
      elements: [instance],
    };
  }

  // `pointerEvents` is checked first: it blocks the event even if the element is enabled.
  const blocked = isEventBlockableByPointerEvents(normalizeEventType(eventType))
    ? getPointerEventsBlockedTargets(skippedTargets)
    : null;
  if (blocked != null) {
    return {
      message:
        blocked.elements.length === 1
          ? `Cannot fire the "${eventType}" event on an element blocked by pointerEvents.`
          : `Cannot fire the "${eventType}" event on elements blocked by pointerEvents.`,
      ...blocked,
    };
  }

  // `computeAriaDisabled` also covers non-editable `TextInput`. A responder declining the touch
  // is a deliberate way of blocking events, so it doesn't warn.
  const disabledTargets = skippedTargets.filter(computeAriaDisabled);
  if (disabledTargets.length === 0) {
    return null;
  }

  return {
    message: `Cannot fire the "${eventType}" event on ${formatDisabledTargets(disabledTargets)}.`,
    elements: disabledTargets,
  };
}
