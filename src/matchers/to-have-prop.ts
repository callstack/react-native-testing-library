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

  const isExpectedValueDefined = expectedValue !== undefined;
  const hasProp = name in element.props;
  const receivedValue = element.props[name];

  const pass = isExpectedValueDefined
    ? hasProp && this.equals(expectedValue, receivedValue)
    : hasProp;

  return {
    pass,
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveProp`,
        'element',
        printExpected(name),
        {
          secondArgument: isExpectedValueDefined
            ? printExpected(expectedValue)
            : undefined,
        }
      );
      return formatMessage(
        matcher,
        `Expected element ${to} have prop`,
        formatProp(name, expectedValue),
        'Received',
        hasProp ? formatProp(name, receivedValue) : undefined
      );
    },
  };
}

function formatProp(name: string, value: unknown) {
  return value === undefined ? name : `${name}=${stringify(value)}`;
}
