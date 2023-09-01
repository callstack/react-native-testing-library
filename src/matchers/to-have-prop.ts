import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, stringify, printExpected } from 'jest-matcher-utils';
import { checkHostElement, formatMessage } from './utils';

export function toHaveProp(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  name: string,
  expectedValue: unknown
) {
  checkHostElement(element, toHaveProp, this);

  const hasProp = name in element.props;
  const value = element.props[name];

  const pass =
    expectedValue !== undefined
      ? hasProp && this.equals(expectedValue, value)
      : hasProp;

  return {
    pass,
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      return formatMessage(
        matcherHint(
          `${this.isNot ? '.not' : ''}.toHaveProp`,
          'element',
          printExpected(name),
          {
            secondArgument:
              expectedValue !== undefined
                ? printExpected(expectedValue)
                : undefined,
          }
        ),
        `Expected element ${to} have prop`,
        formatProp(name, expectedValue),
        'Received',
        hasProp ? formatProp(name, value) : undefined
      );
    },
  };
}

function formatProp(name: string, value: unknown) {
  return value === undefined ? name : `${name}=${stringify(value)}`;
}
