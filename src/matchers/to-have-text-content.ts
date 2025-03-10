import { matcherHint } from 'jest-matcher-utils';
import type { HostElement } from 'universal-test-renderer';

import { getTextContent } from '../helpers/text-content';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveTextContent(
  this: jest.MatcherContext,
  element: HostElement,
  expectedText: TextMatch,
  options?: TextMatchOptions,
) {
  checkHostElement(element, toHaveTextContent, this);

  const text = getTextContent(element);

  return {
    pass: matches(expectedText, text, options?.normalizer, options?.exact),
    message: () => {
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toHaveTextContent`, 'element', ''),
          `Expected element ${this.isNot ? 'not to' : 'to'} have text content`,
          expectedText,
          'Received',
          text,
        ),
      ].join('\n');
    },
  };
}
