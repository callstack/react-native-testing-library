import { matcherHint, stringify } from 'jest-matcher-utils';
import { HostElement } from 'universal-test-renderer';
import { computeAriaValue } from '../helpers/accessibility';
import type { AccessibilityValueMatcher } from '../helpers/matchers/match-accessibility-value';
import { matchAccessibilityValue } from '../helpers/matchers/match-accessibility-value';
import { removeUndefinedKeys } from '../helpers/object';
import { checkHostElement, formatMessage } from './utils';

export function toHaveAccessibilityValue(
  this: jest.MatcherContext,
  element: HostElement,
  expectedValue: AccessibilityValueMatcher,
) {
  checkHostElement(element, toHaveAccessibilityValue, this);

  const receivedValue = computeAriaValue(element);

  return {
    pass: matchAccessibilityValue(element, expectedValue),
    message: () => {
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveAccessibilityValue`,
        'element',
        stringify(expectedValue),
      );
      return formatMessage(
        matcher,
        `Expected the element ${this.isNot ? 'not to' : 'to'} have accessibility value`,
        stringify(expectedValue),
        'Received element with accessibility value',
        stringify(removeUndefinedKeys(receivedValue)),
      );
    },
  };
}
