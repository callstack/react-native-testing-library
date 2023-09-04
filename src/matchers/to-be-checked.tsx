import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import {
  getAccessibilityCheckedState,
  getAccessibilityRole,
  isAccessibilityElement,
} from '../helpers/accessiblity';
import { ErrorWithStack } from '../helpers/errors';
import { checkHostElement, formatElement } from './utils';

export function toBeChecked(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBeChecked, this);

  if (!hasValidAccessibilityRole(element)) {
    throw new ErrorWithStack(
      `toBeChecked() works only on accessibility elements with "checkbox" or "radio" role.`,
      toBeChecked
    );
  }

  return {
    pass: getAccessibilityCheckedState(element) === true,
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBeChecked`, 'element', ''),
        '',
        `Received element ${is} checked:`,
        formatElement(element),
      ].join('\n');
    },
  };
}

const VALID_ROLES = new Set(['checkbox', 'radio']);

function hasValidAccessibilityRole(element: ReactTestInstance) {
  const role = getAccessibilityRole(element);
  return isAccessibilityElement(element) && VALID_ROLES.has(role);
}
