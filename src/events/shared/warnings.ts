import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaDisabled } from '../../helpers/accessibility';
import { formatElement, formatJson } from '../../helpers/format-element';
import { isHostTextInput } from '../../helpers/host-component-names';
import { logger } from '../../helpers/logger';
import { isEditableTextInput } from '../../helpers/text-input';
import { getPointerEventsBlocker } from './pointer-events';

export type EventWarning = {
  message: string;
  elements: TestInstance[];
  /** Elements whose `pointerEvents` blocked the event. */
  pointerEventsBlockers?: TestInstance[];
  /** Elements whose `display: none` hides the elements. */
  displayNoneBlockers?: TestInstance[];
};

export function logEventWarning({
  message,
  elements,
  pointerEventsBlockers = [],
  displayNoneBlockers = [],
}: EventWarning) {
  const header =
    `${message}\n` +
    'If this is intentional, you can disable this warning via `configure({ eventDiagnostics: false })`.';
  const elementBlocks = elements
    .map((element) => element.toJSON())
    .filter((json) => json != null)
    .map((json) => redent(formatJson(json), 2));
  // Blockers are often large containers, so they are printed without their children.
  const blockerBlocks = [...new Set(pointerEventsBlockers)].map((blocker) =>
    redent(formatElement(blocker), 2),
  );
  const blockerSection = blockerBlocks.length > 0 ? ['Blocked by:', ...blockerBlocks] : [];
  const hiderBlocks = [...new Set(displayNoneBlockers)].map((hider) =>
    redent(formatElement(hider), 2),
  );
  const hiderSection = hiderBlocks.length > 0 ? ['Hidden by:', ...hiderBlocks] : [];
  logger.warn([header, ...elementBlocks, ...hiderSection, ...blockerSection].join('\n\n'));
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

export type PressBlockedReason =
  | { kind: 'displayNone'; displayNoneBlocker: TestInstance }
  | ({ kind: 'pointerEvents' } & Pick<EventWarning, 'elements' | 'pointerEventsBlockers'>)
  | { kind: 'disabled'; elements: TestInstance[] };

/**
 * Why a press (or other `userEvent` interaction) didn't reach a handler, in order of precedence:
 * `display: none` hides the element (no touch can land on it), `pointerEvents` blocks skipped
 * elements (even enabled ones), or skipped elements are disabled (`computeAriaDisabled` also
 * covers non-editable `TextInput`). Both modern `fireEvent` and `userEvent` build their warnings
 * from it.
 *
 * @param skippedTargets elements that could handle the press but didn't get it, nearest first.
 * @returns `null` when nothing blocked it, e.g. a responder declined the touch or no element has
 * a handler.
 */
export function getPressBlockedReason(
  skippedTargets: TestInstance[],
  displayNoneBlocker: TestInstance | null,
): PressBlockedReason | null {
  if (displayNoneBlocker != null) {
    return { kind: 'displayNone', displayNoneBlocker };
  }

  const blocked = getPointerEventsBlockedTargets(skippedTargets);
  if (blocked != null) {
    return { kind: 'pointerEvents', ...blocked };
  }

  const disabledTargets = skippedTargets.filter(computeAriaDisabled);
  if (disabledTargets.length > 0) {
    return { kind: 'disabled', elements: disabledTargets };
  }

  return null;
}

/**
 * Describes the elements that `computeAriaDisabled` treats as disabled, e.g. "a disabled element".
 * Non-editable `TextInput`s are called non-editable, which is what users set (`editable={false}`
 * or `readOnly`).
 */
export function formatDisabledTargets(targets: TestInstance[]): string {
  if (targets.every((target) => isHostTextInput(target) && !isEditableTextInput(target))) {
    return targets.length === 1 ? 'a non-editable TextInput' : 'non-editable TextInputs';
  }

  return targets.length === 1 ? 'a disabled element' : 'disabled elements';
}
