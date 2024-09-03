import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { computeAriaChecked, getRole, isAccessibilityElement } from '../helpers/accessibility';
import { ErrorWithStack } from '../helpers/errors';
import { checkHostElement, formatElement } from './utils';

export function toBeChecked(this: jest.MatcherContext, element: ReactTestInstance) {
  checkHostElement(element, toBeChecked, this);

  if (!hasValidAccessibilityRole(element)) {
    throw new ErrorWithStack(
      `toBeChecked() works only on accessibility elements with "checkbox" or "radio" role.`,
      toBeChecked,
    );
  }

  return {
    pass: computeAriaChecked(element) === true,
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

function hasValidAccessibilityRole(element: ReactTestInstance) {
  if (!isAccessibilityElement(element)) {
    return false;
  }

  const role = getRole(element);
  return role === 'checkbox' || role === 'radio';
}
