import { matcherHint } from 'jest-matcher-utils';
import { HostComponent } from 'universal-test-renderer';
import { computeAriaChecked, getRole, isAccessibilityElement } from '../helpers/accessibility';
import { ErrorWithStack } from '../helpers/errors';
import { checkHostElement, formatElement } from './utils';

export function toBePartiallyChecked(this: jest.MatcherContext, element: HostComponent) {
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
        formatElement(element),
      ].join('\n');
    },
  };
}

function hasValidAccessibilityRole(element: HostComponent) {
  const role = getRole(element);
  return isAccessibilityElement(element) && role === 'checkbox';
}
