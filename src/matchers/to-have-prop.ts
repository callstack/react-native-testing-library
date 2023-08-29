import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, stringify, printExpected } from 'jest-matcher-utils';
import { checkHostElement, formatMessage } from './utils';

function printAttribute(name: string, value: unknown) {
  return value === undefined ? name : `${name}=${stringify(value)}`;
}

function getPropComment(name: string, value: unknown) {
  return value === undefined
    ? `Element should have prop ${name}`
    : `Element should have prop ${name} with value ${stringify(value)}`;
}

export function toHaveProp(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  name: string,
  expectedValue: unknown
) {
  checkHostElement(element, toHaveProp, this);

  const propValue = element.props[name];

  const isDefined = expectedValue !== undefined;
  const hasProp = name in element.props;

  return {
    pass: isDefined
      ? hasProp && this.equals(propValue, expectedValue)
      : hasProp,
    message: () => {
      const to = this.isNot ? 'not to' : 'to';

      const receivedProp = hasProp ? printAttribute(name, propValue) : null;
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveProp`,
        'element',
        printExpected(name),
        {
          secondArgument: isDefined ? printExpected(expectedValue) : undefined,
          comment: getPropComment(name, expectedValue),
        }
      );
      return formatMessage(
        matcher,
        `Expected the element ${to} have prop`,
        printAttribute(name, expectedValue),
        'Received',
        receivedProp
      );
    },
  };
}
