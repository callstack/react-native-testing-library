import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint } from 'jest-matcher-utils';
import { isHostTextInput } from '../helpers/host-component-names';
import { ErrorWithStack } from '../helpers/errors';
import { TextMatch, TextMatchOptions, matches } from '../matches';
import { checkHostElement, formatMessage } from './utils';

export function toHaveDisplayValue(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  expectedValue: TextMatch,
  options?: TextMatchOptions
) {
  checkHostElement(element, toHaveDisplayValue, this);

  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `toHaveDisplayValue() works only with host "TextInput" elements. Passed element has type "${element.type}".`,
      toHaveDisplayValue
    );
  }

  const value = element.props.value ?? element.props.defaultValue;

  return {
    pass: matches(expectedValue, value, options?.normalizer, options?.exact),
    message: () => {
      return [
        formatMessage(
          matcherHint(
            `${this.isNot ? '.not' : ''}.toHaveDisplayValue`,
            'element',
            ''
          ),
          `Expected element ${this.isNot ? 'not to' : 'to'} have display value`,
          expectedValue,
          'Received',
          value
        ),
      ].join('\n');
    },
  };
}
