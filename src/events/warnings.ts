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
  /** Elements whose handler was rejected by `isEventEnabled`, nearest first. */
  skippedTargets: TestInstance[];
  didUpdateNativeState: boolean;
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
  if (warning == null) {
    return;
  }

  const header =
    `${warning.message}\n` +
    'If this is intentional, you can disable this warning via `configure({ eventDiagnostics: false })`.';
  const elementBlocks = warning.elements
    .map((element) => element.toJSON())
    .filter((json) => json != null)
    .map((json) => redent(formatJson(json), 2));
  logger.warn([header, ...elementBlocks].join('\n\n'));
}

function getUnhandledEventWarning(
  instance: TestInstance,
  eventName: string,
  { skippedTargets, didUpdateNativeState }: UnhandledEventInfo,
): { message: string; elements: TestInstance[] } | null {
  if (skippedTargets.length === 0) {
    if (isDirectEvent(normalizeEventName(eventName))) {
      return {
        message: `No handler found for the "${eventName}" event on the element. "${eventName}" events do not bubble to ancestors.`,
        elements: [instance],
      };
    }

    // The event still had an effect, e.g. `changeText` on an uncontrolled TextInput updates its value.
    if (didUpdateNativeState) {
      return null;
    }

    return {
      message: `No handler found for the "${eventName}" event on the element or any of its ancestors.`,
      elements: [instance],
    };
  }

  // Only disabled elements are reported. Other rejections (`pointerEvents`, non-editable
  // `TextInput`, responder declining the touch) are deliberate ways of blocking events.
  const disabledTargets = skippedTargets.filter(isWarnableDisabledTarget);
  if (disabledTargets.length === 0) {
    return null;
  }

  return {
    message:
      disabledTargets.length === 1
        ? `Tried to fire the "${eventName}" event on a disabled element, so its handler was not called.`
        : `Tried to fire the "${eventName}" event on ${disabledTargets.length} disabled elements, so their handlers were not called.`,
    elements: disabledTargets,
  };
}

function isWarnableDisabledTarget(target: TestInstance): boolean {
  // `computeAriaDisabled` treats non-editable TextInput as disabled for a11y purposes,
  // but firing events on it is expected, not a bug worth warning about.
  if (isHostTextInput(target) && !isEditableTextInput(target)) {
    return false;
  }

  return computeAriaDisabled(target);
}
