import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import {
  getAccessibilityCheckedState,
  getAccessibilityRole,
  isAccessibilityElement,
} from '../helpers/accessiblity';
import { ErrorWithStack } from '../helpers/errors';
import { checkHostElement, formatElement } from './utils';

export function toBePartiallyChecked(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBePartiallyChecked, this);

  if (!hasValidAccessibilityRole(element)) {
    throw new ErrorWithStack(
      'toBePartiallyChecked() works only on accessibility elements with "checkbox" role.',
      toBePartiallyChecked
    );
  }

  return {
    pass: getAccessibilityCheckedState(element) === 'mixed',
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(
          `${this.isNot ? '.not' : ''}.toBePartiallyChecked`,
          'element',
          ''
        ),
        '',
        `Received element ${is} partially checked:`,
        formatElement(element),
      ].join('\n');
    },
  };
}

function hasValidAccessibilityRole(element: ReactTestInstance) {
  const role = getAccessibilityRole(element);
  return isAccessibilityElement(element) && role === 'checkbox';
}
