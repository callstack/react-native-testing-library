import type { HostElement } from 'universal-test-renderer';
import { matcherHint } from 'jest-matcher-utils';

import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { getTextInputValue } from '../helpers/text-input';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveDisplayValue(
  this: jest.MatcherContext,
  element: HostElement,
  expectedValue: TextMatch,
  options?: TextMatchOptions,
) {
  checkHostElement(element, toHaveDisplayValue, this);

  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `toHaveDisplayValue() works only with host "TextInput" elements. Passed element has type "${element.type}".`,
      toHaveDisplayValue,
    );
  }

  const receivedValue = getTextInputValue(element);

  return {
    pass: matches(expectedValue, receivedValue, options?.normalizer, options?.exact),
    message: () => {
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toHaveDisplayValue`, 'element', ''),
          `Expected element ${this.isNot ? 'not to' : 'to'} have display value`,
          expectedValue,
          'Received',
          receivedValue,
        ),
      ].join('\n');
    },
  };
}
