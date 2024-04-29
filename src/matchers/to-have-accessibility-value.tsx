import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, stringify } from 'jest-matcher-utils';
import { getAccessibilityValue } from '../helpers/accessibility';
import {
  AccessibilityValueMatcher,
  matchAccessibilityValue,
} from '../helpers/matchers/match-accessibility-value';
import { removeUndefinedKeys } from '../helpers/object';
import { checkHostElement, formatMessage } from './utils';

export function toHaveAccessibilityValue(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  expectedValue: AccessibilityValueMatcher,
) {
  checkHostElement(element, toHaveAccessibilityValue, this);

  const receivedValue = getAccessibilityValue(element);

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
