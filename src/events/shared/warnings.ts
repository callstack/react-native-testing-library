import redent from 'redent';
import type { TestInstance } from 'test-renderer';

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
};

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
    redent(formatElement(blocker), 2),
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
