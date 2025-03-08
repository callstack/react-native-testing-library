import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { HostElement } from 'universal-test-renderer';

import { computeAriaChecked, getRole, isAccessibilityElement } from '../helpers/accessibility';
import { ErrorWithStack } from '../helpers/errors';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBePartiallyChecked(this: jest.MatcherContext, element: HostElement) {
  checkHostElement(element, toBePartiallyChecked, this);

  if (!hasValidAccessibilityRole(element)) {
    throw new ErrorWithStack(
      'toBePartiallyChecked() works only on accessibility elements with "checkbox" role.',
      toBePartiallyChecked,
    );
  }

  return {
    pass: computeAriaChecked(element) === 'mixed',
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBePartiallyChecked`, 'element', ''),
        '',
        `Received element ${is} partially checked:`,
        redent(formatElement(element), 2),
      ].join('\n');
    },
  };
}

function hasValidAccessibilityRole(element: HostElement) {
  const role = getRole(element);
  return isAccessibilityElement(element) && role === 'checkbox';
}
