import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { getConfig } from '../config';
import { computeAriaDisabled } from '../helpers/accessibility';
import { formatElement, formatJson } from '../helpers/format-element';
import { isHostTextInput } from '../helpers/host-component-names';
import { logger } from '../helpers/logger';
import { isEditableTextInput } from '../helpers/text-input';
import { normalizeEventName } from './handler';
import { getPointerEventsBlocker, isBlockableByPointerEvents } from './is-enabled';
import { isDirectEvent } from './propagation';

type UnhandledEventInfo = {
  skippedTargets: TestInstance[];
  hasUpdatedNativeState: boolean;
};

export type EventWarning = {
  message: string;
  elements: TestInstance[];
  /** Elements whose `pointerEvents` blocked the event. */
  pointerEventsBlockers?: TestInstance[];
};

/**
 * Warns when no handler ran because the target is disabled or nothing handles the event.
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
 * Returns the targets that `pointerEvents` blocks along with their blockers, or `null` if it
 * blocks none of them.
 *
 * @param targets Skipped elements, nearest first.
 */
export function getPointerEventsBlockedTargets(
  targets: TestInstance[],
): Pick<EventWarning, 'elements' | 'pointerEventsBlockers'> | null {
  const elements: TestInstance[] = [];
  const pointerEventsBlockers: TestInstance[] = [];
  for (const target of targets) {
    const blocker = getPointerEventsBlocker(target);
    if (blocker != null) {
      elements.push(target);
      pointerEventsBlockers.push(blocker);
    }
  }

  return elements.length > 0 ? { elements, pointerEventsBlockers } : null;
}

/**
 * Describes the elements that `computeAriaDisabled` treats as disabled, e.g. "a disabled element".
 * Non-editable `TextInput`s are called non-editable, which is what users set (`editable={false}`).
 */
export function formatDisabledTargets(targets: TestInstance[]): string {
  if (targets.every((target) => isHostTextInput(target) && !isEditableTextInput(target))) {
    return targets.length === 1 ? 'a non-editable TextInput' : 'non-editable TextInputs';
  }

  return targets.length === 1 ? 'a disabled element' : 'disabled elements';
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
  const blocked = isBlockableByPointerEvents(normalizeEventName(eventName))
    ? getPointerEventsBlockedTargets(skippedTargets)
    : null;
  if (blocked != null) {
    return {
      message:
        blocked.elements.length === 1
          ? `Cannot fire the "${eventName}" event on an element blocked by pointerEvents.`
          : `Cannot fire the "${eventName}" event on elements blocked by pointerEvents.`,
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
    message: `Cannot fire the "${eventName}" event on ${formatDisabledTargets(disabledTargets)}.`,
    elements: disabledTargets,
  };
}
