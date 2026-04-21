import { matcherHint } from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { computeAriaChecked, getRole, isAccessibilityElement } from '../helpers/accessibility';
import { ErrorWithStack } from '../helpers/errors';
import { formatElement } from '../helpers/format-element';
import { checkHostElement } from './utils';

export function toBePartiallyChecked(this: jest.MatcherContext, instance: TestInstance) {
  checkHostElement(instance, toBePartiallyChecked, this);

  if (!hasValidAccessibilityRole(instance)) {
    throw new ErrorWithStack(
      'toBePartiallyChecked() works only on accessibility elements with "checkbox" role.',
      toBePartiallyChecked,
    );
  }

  return {
    pass: computeAriaChecked(instance) === 'mixed',
    message: () => {
      const is = this.isNot ? 'is' : 'is not';
      return [
        matcherHint(`${this.isNot ? '.not' : ''}.toBePartiallyChecked`, 'instance', ''),
        '',
        `Received instance ${is} partially checked:`,
        redent(formatElement(instance), 2),
      ].join('\n');
    },
  };
}

function hasValidAccessibilityRole(instance: TestInstance) {
  const role = getRole(instance);
  return isAccessibilityElement(instance) && role === 'checkbox';
}
