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
import type { DroppedEventReason } from './emitting-target';
import type { EventTypeConfig, PressabilityEventType } from './event-types';
import type { PressResponderResult } from './pressability';
import { getDisplayNoneBlocker } from './pressability';

/**
 * Warns when `getEmittingTarget()` dropped the event, as the element can't emit it: hidden by
 * `display: none`, blocked by `pointerEvents`, a non-editable `TextInput` or a disabled `Switch`.
 *
 * @param reportedEventType the event type the user fired, e.g. `changeText` for a `change` event.
 */
export function warnAboutDroppedEvent(
  instance: TestInstance,
  eventType: string,
  reason: DroppedEventReason,
  reportedEventType: string = eventType,
) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  const warning = getDroppedEventWarning(instance, reason, reportedEventType);
  if (warning != null) {
    logEventWarning(warning);
  }
}

/**
 * Warns when a dispatched event called no handler and didn't update native state.
 *
 * @param target the element that emitted the event.
 * @param handlerName the handler to name, e.g. `onChangeText` for `fireEvent.changeText()`.
 * Defaults to the event type's bubbling handler.
 */
export function warnAboutUnhandledEvent(
  target: TestInstance,
  typeConfig: EventTypeConfig,
  handlerName: string = typeConfig.handlerName,
) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  logEventWarning({
    message:
      typeConfig.kind === 'direct'
        ? `No "${handlerName}" handler found on the element.`
        : `No "${handlerName}" handler found on the element or its ancestors.`,
    elements: [target],
  });
}

type UnhandledPressabilityEventInfo = PressResponderResult & {
  /** The touch path from `getTouchPath()`. */
  path: TestInstance[];
};

/**
 * Warns when a Pressability event (`press`, `pressIn`, `pressOut`, `longPress`) wasn't handled,
 * per `dispatchPressabilityEvent()`. Doesn't warn when a responder declines the touch on purpose.
 */
export function warnAboutUnhandledPressabilityEvent(
  instance: TestInstance,
  eventType: PressabilityEventType,
  info: UnhandledPressabilityEventInfo,
) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  const warning = getUnhandledPressabilityEventWarning(instance, eventType, info);
  if (warning != null) {
    logEventWarning(warning);
  }
}

function getDroppedEventWarning(
  instance: TestInstance,
  reason: DroppedEventReason,
  reportedEventType: string,
): EventWarning | null {
  switch (reason.kind) {
    case 'displayNone':
      return getDisplayNoneWarning(instance, reportedEventType, reason.displayNoneBlocker);
    case 'pointerEvents':
      return getPointerEventsWarning([instance], reportedEventType);
    case 'nonEditable':
      return getDisabledWarning([reason.textInput], reportedEventType);
    case 'disabledSwitch':
      return getDisabledWarning([instance], reportedEventType);
  }
}

function getUnhandledPressabilityEventWarning(
  instance: TestInstance,
  eventType: PressabilityEventType,
  { path, responder, skippedTargets }: UnhandledPressabilityEventInfo,
): EventWarning | null {
  if (path.length === 0) {
    const displayNoneBlocker = getDisplayNoneBlocker(instance);
    if (displayNoneBlocker != null) {
      return getDisplayNoneWarning(instance, eventType, displayNoneBlocker);
    }
  }

  // `pointerEvents` is checked first: it blocks the touch even if the element is enabled.
  const blockedWarning = getPointerEventsWarning(skippedTargets, eventType);
  if (blockedWarning != null) {
    return blockedWarning;
  }

  const disabledTargets = skippedTargets.filter(computeAriaDisabled);
  if (disabledTargets.length > 0) {
    return getDisabledWarning(disabledTargets, eventType);
  }

  const handlerName = getEventHandlerName(eventType);
  if (responder != null) {
    return {
      message: `No "${handlerName}" handler found on the touch responder.`,
      elements: [responder],
    };
  }

  // A responder declining the touch is a deliberate way of blocking it, so it doesn't warn.
  if (skippedTargets.length > 0) {
    return null;
  }

  return {
    message: `No "${handlerName}" handler found on the element or its ancestors.`,
    elements: [instance],
  };
}

function getDisplayNoneWarning(
  instance: TestInstance,
  eventType: string,
  displayNoneBlocker: TestInstance,
): EventWarning {
  return {
    message: `Cannot fire the "${eventType}" event on an element hidden by display: none.`,
    elements: [instance],
    displayNoneBlockers: [displayNoneBlocker],
  };
}

function getPointerEventsWarning(targets: TestInstance[], eventType: string): EventWarning | null {
  const blocked = getPointerEventsBlockedTargets(targets);
  if (blocked == null) {
    return null;
  }

  return {
    message:
      blocked.elements.length === 1
        ? `Cannot fire the "${eventType}" event on an element blocked by pointerEvents.`
        : `Cannot fire the "${eventType}" event on elements blocked by pointerEvents.`,
    ...blocked,
  };
}

function getDisabledWarning(targets: TestInstance[], eventType: string): EventWarning {
  return {
    message: `Cannot fire the "${eventType}" event on ${formatDisabledTargets(targets)}.`,
    elements: targets,
  };
}
