import { matcherHint } from 'jest-matcher-utils';
import type { HostElement } from 'universal-test-renderer';

import { computeAccessibleName } from '../helpers/accessibility';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveAccessibleName(
  this: jest.MatcherContext,
  element: HostElement,
  expectedName?: TextMatch,
  options?: TextMatchOptions,
) {
  checkHostElement(element, toHaveAccessibleName, this);

  const receivedName = computeAccessibleName(element);
  const missingExpectedValue = arguments.length === 1;

  let pass = false;
  if (missingExpectedValue) {
    pass = receivedName !== '';
  } else {
    pass =
      expectedName != null
        ? matches(expectedName, receivedName, options?.normalizer, options?.exact)
        : false;
  }

  return {
    pass,
    message: () => {
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toHaveAccessibleName`, 'element', ''),
          `Expected element ${this.isNot ? 'not to' : 'to'} have accessible name`,
          expectedName,
          'Received',
          receivedName,
        ),
      ].join('\n');
    },
  };
}
