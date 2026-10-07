import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { getConfig } from '../config';
import { computeAriaDisabled } from '../helpers/accessibility';
import { formatJson } from '../helpers/format-element';
import { isHostTextInput } from '../helpers/host-component-names';
import { logger } from '../helpers/logger';
import { isEditableTextInput } from '../helpers/text-input';
import { normalizeEventName } from './handler';
import { isDirectEvent } from './propagation';

export type UnhandledEventInfo = {
  /** Nearest element whose handler was rejected by `isEventEnabled`, if any. */
  rejectedTarget: TestInstance | null;
  didUpdateNativeState: boolean;
};

/**
 * Warns when no handler ran because the target is disabled or nothing handles the event.
 * Opt out via `configure({ eventDiagnostics: false })`.
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
  if (warning == null) {
    return;
  }

  const elementJson = warning.element.toJSON();
  logger.warn(
    `${warning.message}\n` +
      'If this is intentional, you can disable this warning via `configure({ eventDiagnostics: false })`.\n\n' +
      redent(elementJson ? formatJson(elementJson) : '(hidden)', 2),
  );
}

function getUnhandledEventWarning(
  instance: TestInstance,
  eventName: string,
  { rejectedTarget, didUpdateNativeState }: UnhandledEventInfo,
): { message: string; element: TestInstance } | null {
  if (rejectedTarget == null) {
    if (isDirectEvent(normalizeEventName(eventName))) {
      return {
        message: `No handler found for the "${eventName}" event on the element. "${eventName}" events do not bubble to ancestors.`,
        element: instance,
      };
    }

    // The event still had an effect, e.g. `changeText` on an uncontrolled TextInput updates its value.
    if (didUpdateNativeState) {
      return null;
    }

    return {
      message: `No handler found for the "${eventName}" event on the element or any of its ancestors.`,
      element: instance,
    };
  }

  // Other rejections (`pointerEvents`, non-editable `TextInput`, responder declining the touch)
  // are deliberate ways of blocking events, so they are not reported.
  if (isWarnableDisabledTarget(rejectedTarget)) {
    return {
      message: `Tried to fire the "${eventName}" event on a disabled element, so its handler was not called.`,
      element: rejectedTarget,
    };
  }

  return null;
}

function isWarnableDisabledTarget(target: TestInstance): boolean {
  // `computeAriaDisabled` treats non-editable TextInput as disabled for a11y purposes,
  // but firing events on it is expected, not a bug worth warning about.
  if (isHostTextInput(target) && !isEditableTextInput(target)) {
    return false;
  }

  return computeAriaDisabled(target);
}
