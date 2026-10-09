import { getConfig } from '../../config';
import type { EventWarning } from '../../events/shared/warnings';
import {
  formatDisabledTargets,
  getPointerEventsBlockedTargets,
  logEventWarning,
} from '../../events/shared/warnings';
import { computeAriaDisabled } from '../../helpers/accessibility';
import type { Interaction } from './interaction';

/**
 * Warns when none of the events of a `userEvent` interaction called a handler or updated
 * native state.
 */
export function warnAboutUnhandledInteraction(interaction: Interaction) {
  if (!getConfig().eventDiagnostics) {
    return;
  }

  // The interaction had an effect, e.g. typing into an uncontrolled TextInput updates its value.
  if (interaction.hasCalledHandler || interaction.hasUpdatedNativeState) {
    return;
  }

  const warning = getUnhandledInteractionWarning(interaction);
  if (warning != null) {
    logEventWarning(warning);
  }
}

function getUnhandledInteractionWarning({
  name,
  target,
  eventNames,
  skippedTargets,
}: Interaction): EventWarning | null {
  const summary = `${name}() interaction did not call any event handlers.`;

  // `pointerEvents` is checked first: it blocks the interaction even if the element is enabled.
  const blocked = getPointerEventsBlockedTargets(skippedTargets);
  if (blocked != null) {
    return {
      message:
        blocked.elements.length === 1
          ? `${summary} The element is blocked by pointerEvents.`
          : `${summary} The elements are blocked by pointerEvents.`,
      ...blocked,
    };
  }

  // `computeAriaDisabled` also covers non-editable `TextInput`.
  const disabledTargets = skippedTargets.filter(computeAriaDisabled);
  if (disabledTargets.length > 0) {
    return {
      message: `${summary} Cannot interact with ${formatDisabledTargets(disabledTargets)}.`,
      elements: disabledTargets,
    };
  }

  if (eventNames.length === 0) {
    if (skippedTargets.length > 0) {
      return null;
    }

    return {
      message: `${summary} The element and its ancestors have no handlers for this interaction.`,
      elements: [target],
    };
  }

  const quotedNames = [...new Set(eventNames)].map((eventName) => `"${eventName}"`);
  return {
    message:
      quotedNames.length === 1
        ? `${summary} The element has no handler for the ${quotedNames[0]} event.`
        : `${summary} The element has no handler for the ${formatOrList(quotedNames)} events.`,
    elements: [target],
  };
}

function formatOrList(items: string[]): string {
  return `${items.slice(0, -1).join(', ')} or ${items.at(-1)}`;
}
