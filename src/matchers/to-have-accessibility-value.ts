import { matcherHint, stringify } from 'jest-matcher-utils';
import type { TestInstance } from 'test-renderer';

import { computeAriaValue } from '../helpers/accessibility';
import type { AccessibilityValueMatcher } from '../helpers/matchers/match-accessibility-value';
import { matchAccessibilityValue } from '../helpers/matchers/match-accessibility-value';
import { removeUndefinedKeys } from '../helpers/object';
import type { MatcherContext } from './utils';
import { checkHostElement, formatMessage } from './utils';

export function toHaveAccessibilityValue(
  this: MatcherContext,
  instance: TestInstance,
  expectedValue: AccessibilityValueMatcher,
) {
  checkHostElement(instance, toHaveAccessibilityValue, this);

  const receivedValue = computeAriaValue(instance);

  return {
    pass: matchAccessibilityValue(instance, expectedValue),
    message: () => {
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveAccessibilityValue`,
        'instance',
        stringify(expectedValue),
      );
      return formatMessage(
        matcher,
        `Expected the instance ${this.isNot ? 'not to' : 'to'} have accessibility value`,
        stringify(expectedValue),
        'Received instance with accessibility value',
        stringify(removeUndefinedKeys(receivedValue)),
      );
    },
  };
}
