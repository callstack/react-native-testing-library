import { matcherHint } from 'jest-matcher-utils';
import type { TestInstance } from 'test-renderer';

import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { getTextInputValue } from '../helpers/text-input';
import type { TextMatch, TextMatchOptions } from '../matches';
import { matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveDisplayValue(
  this: jest.MatcherContext,
  instance: TestInstance,
  expectedValue: TextMatch,
  options?: TextMatchOptions,
) {
  checkHostElement(instance, toHaveDisplayValue, this);

  if (!isHostTextInput(instance)) {
    throw new ErrorWithStack(
      `toHaveDisplayValue() works only with host "TextInput" instances. Passed instance has type "${instance.type}".`,
      toHaveDisplayValue,
    );
  }

  const receivedValue = getTextInputValue(instance);

  return {
    pass: matches(expectedValue, receivedValue, options?.normalizer, options?.exact),
    message: () => {
      return [
        formatMessage(
          matcherHint(`${this.isNot ? '.not' : ''}.toHaveDisplayValue`, 'instance', ''),
          `Expected instance ${this.isNot ? 'not to' : 'to'} have display value`,
          expectedValue,
          'Received',
          receivedValue,
        ),
      ].join('\n');
    },
  };
}
