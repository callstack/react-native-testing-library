import { getConfig } from '../../config';
import type { EventWarning } from '../../events';
import { isWarnableDisabledTarget, logEventWarning } from '../../events';
import type { Interaction } from './interaction';

/**
 * Warns when none of the events of a `userEvent` interaction called a handler or updated
 * native state. Enabled via `configure({ eventDiagnostics: true })`.
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
  const summary = `${name}() did not call any event handlers.`;

  const disabledTargets = skippedTargets.filter(isWarnableDisabledTarget);
  if (disabledTargets.length > 0) {
    return {
      message:
        disabledTargets.length === 1
          ? `${summary} The element is disabled.`
          : `${summary} The elements are disabled.`,
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
