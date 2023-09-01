import { AccessibilityState } from 'react-native';
import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import {
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
      `toBeChecked() works only on accessibility element with accessibility role of "checkbox" or "radio".`,
      toBeChecked
    );
  }

  return {
    pass: getCheckedState(element) === true,
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

export function toBePartiallyChecked(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  checkHostElement(element, toBePartiallyChecked, this);

  if (!hasValidAccessibilityRole(element)) {
    throw new ErrorWithStack(
      `toBePartiallyChecked() works only on accessibility element with accessibility role of "checkbox" or "radio".`,
      toBePartiallyChecked
    );
  }

  return {
    pass: getCheckedState(element) === 'mixed',
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

const VALID_ROLES = new Set(['checkbox', 'radio']);

function hasValidAccessibilityRole(element: ReactTestInstance) {
  const role = getAccessibilityRole(element);
  return isAccessibilityElement(element) && VALID_ROLES.has(role);
}

function getCheckedState(
  element: ReactTestInstance
): AccessibilityState['checked'] {
  const { accessibilityState, 'aria-checked': ariaChecked } = element.props;
  return ariaChecked ?? accessibilityState.checked;
}
