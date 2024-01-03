import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { getAccessibleName } from '../helpers/accessiblity';
import { TextMatch, TextMatchOptions, matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveAccessibleName(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  expectedName?: TextMatch,
  options?: TextMatchOptions
) {
  checkHostElement(element, toHaveAccessibleName, this);

  const receivedName = getAccessibleName(element);
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
          receivedName
        ),
      ].join('\n');
    },
  };
}
