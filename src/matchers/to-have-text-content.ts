import { matcherHint } from 'jest-matcher-utils';
import type { TestInstance } from 'test-renderer';

import { getTextContent } from '../helpers/text-content';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveTextContent(
  this: jest.MatcherContext,
  instance: TestInstance,
  expectedText: TextMatch,
  options?: TextMatchOptions,
) {
  checkHostElement(instance, toHaveTextContent, this);

  const text = getTextContent(instance);

  return {
    pass: matches(expectedText, text, options?.normalizer, options?.exact),
    message: () => {
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toHaveTextContent`, 'instance', ''),
          `Expected instance ${this.isNot ? 'not to' : 'to'} have text content`,
          expectedText,
          'Received',
          text,
        ),
      ].join('\n');
    },
  };
}
