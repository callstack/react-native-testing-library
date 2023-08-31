import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { isAccessibilityElement } from '../helpers/accessiblity';
import { formatElement } from './utils';

export function toBeChecked(
  this: jest.MatcherContext,
  element: ReactTestInstance
) {
  if (!isValidAccessibilityRole(element)) {
    return {
      pass: false,
      message: () =>
        `only accessibility element with accessibilityRole="checkbox" or accessibilityRole="radio" can be used with .toBeChecked()`,
    };
  }
  const checkedState = element.props?.accessibilityState?.checked;
  const pass = checkedState === true;

  return {
    pass,
    message: () => {
      const is = pass ? 'is' : 'is not';
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
  if (!isValidAccessibilityRole(element)) {
    return {
      pass: false,
      message: () =>
        `only accessibility element with accessibilityRole="checkbox" or accessibilityRole="radio" can be used with .toBePartiallyChecked()`,
    };
  }

  const checkedState = element.props?.accessibilityState?.checked;
  const pass = checkedState === 'mixed';

  return {
    pass,
    message: () => {
      const is = pass ? 'is' : 'is not';
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

const isValidAccessibilityRole = (element: ReactTestInstance) => {
  const role = element.props?.accessibilityRole;
  return (
    isAccessibilityElement(element) && (role === 'checkbox' || role === 'radio')
  );
};
