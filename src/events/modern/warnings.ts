import type { TestInstance } from 'test-renderer';

import { getConfig } from '../../config';
import { computeAriaDisabled } from '../../helpers/accessibility';
import { getEventHandlerName } from '../shared/handler';
import type { EventWarning } from '../shared/warnings';
import {
  formatDisabledTargets,
  getPointerEventsBlockedTargets,
  logEventWarning,
} from '../shared/warnings';
import type { SyntheticEvent } from './event';
import { getEventInternals } from './event';
import type { PressabilityEventType } from './event-types';
import { getPressabilityCallbackOwners } from './pressability';

/**
 * Warns when `dispatchEvent()` called no handler and the event updated no native state. Modern
 * dispatch skips no handlers, so the only cause is that no element on the path has one.
 */
export function warnAboutUnhandledEvent(instance: TestInstance, event: SyntheticEvent) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  const { kind, handlerName } = getEventInternals(event).typeConfig;
  logEventWarning({
    message:
      kind === 'direct'
        ? `No "${handlerName}" handler found on the element.`
        : `No "${handlerName}" handler found on the element or its ancestors.`,
    elements: [instance],
  });
}

/** Warns when `fireEvent.changeText()` skipped a non-editable `TextInput`. */
export function warnAboutNonEditableTextInput(instance: TestInstance) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  logEventWarning({
    message: `Cannot fire the "changeText" event on ${formatDisabledTargets([instance])}.`,
    elements: [instance],
  });
}

/**
 * Warns when `dispatchPressabilityEvent()` called no callback because the elements with one are
 * disabled or blocked by `pointerEvents`, or no element has one.
 */
export function warnAboutUnhandledPressabilityEvent(
  instance: TestInstance,
  eventType: PressabilityEventType,
) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  const warning = getUnhandledPressabilityEventWarning(instance, eventType);
  if (warning != null) {
    logEventWarning(warning);
  }
}

function getUnhandledPressabilityEventWarning(
  instance: TestInstance,
  eventType: PressabilityEventType,
): EventWarning | null {
  const skippedTargets = getPressabilityCallbackOwners(instance, eventType);
  if (skippedTargets.length === 0) {
    return {
      message: `No "${getEventHandlerName(eventType)}" handler found on the element or its ancestors.`,
      elements: [instance],
    };
  }

  // `pointerEvents` is checked first: it blocks the touch even if the element is enabled.
  const blocked = getPointerEventsBlockedTargets(skippedTargets);
  if (blocked != null) {
    return {
      message:
        blocked.elements.length === 1
          ? `Cannot fire the "${eventType}" event on an element blocked by pointerEvents.`
          : `Cannot fire the "${eventType}" event on elements blocked by pointerEvents.`,
      ...blocked,
    };
  }

  // `computeAriaDisabled` also covers non-editable `TextInput`. A responder declining the touch,
  // or claiming it without the callback (`PanResponder`), is deliberate, so it doesn't warn.
  const disabledTargets = skippedTargets.filter(computeAriaDisabled);
  if (disabledTargets.length === 0) {
    return null;
  }

  return {
    message: `Cannot fire the "${eventType}" event on ${formatDisabledTargets(disabledTargets)}.`,
    elements: disabledTargets,
  };
}
