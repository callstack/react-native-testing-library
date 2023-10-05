import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { TextMatch, TextMatchOptions, matches } from '../matches';
import { getAccessibleName } from '../helpers/accessiblity';
import { checkHostElement, formatMessage } from './utils';

export function matchAccessibleName(
  node: ReactTestInstance,
  expectedName?: TextMatch,
  normalizer?: TextMatchOptions['normalizer'],
  exact?: TextMatchOptions['exact']
): boolean {
  const accessibleName = getAccessibleName(node);

  if (expectedName) {
    return matches(expectedName, accessibleName, normalizer, exact);
  }

  return !!accessibleName;
}

export function toHaveAccessibleName(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  expectedName?: TextMatch,
  options?: TextMatchOptions
) {
  checkHostElement(element, toHaveAccessibleName, this);

  const receivedName = getAccessibleName(element);

  return {
    pass: matchAccessibleName(
      element,
      expectedName,
      options?.normalizer,
      options?.exact
    ),
    message: () => {
      return [
        formatMessage(
          matcherHint(
            `${this.isNot ? '.not' : ''}.toHaveAccessibleName`,
            'element',
            ''
          ),
          `Expected element ${
            this.isNot ? 'not to' : 'to'
          } have accessible name`,
          `${expectedName ? expectedName : ''}`,
          'Received',
          receivedName
        ),
      ].join('\n');
    },
  };
}
