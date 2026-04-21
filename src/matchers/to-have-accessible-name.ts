import { matcherHint } from 'jest-matcher-utils';
import type { TestInstance } from 'test-renderer';

import { computeAccessibleName } from '../helpers/accessibility';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveAccessibleName(
  this: jest.MatcherContext,
  instance: TestInstance,
  expectedName?: TextMatch,
  options?: TextMatchOptions,
) {
  checkHostElement(instance, toHaveAccessibleName, this);

  const receivedName = computeAccessibleName(instance);
  const missingExpectedValue = arguments.length === 1;

  const pass = missingExpectedValue
    ? receivedName !== ''
    : expectedName != null
      ? matches(expectedName, receivedName, options?.normalizer, options?.exact)
      : false;

  return {
    pass,
    message: () => {
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toHaveAccessibleName`, 'instance', ''),
          `Expected instance ${this.isNot ? 'not to' : 'to'} have accessible name`,
          expectedName,
          'Received',
          receivedName,
        ),
      ].join('\n');
    },
  };
}
