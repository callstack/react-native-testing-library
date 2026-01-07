import { matcherHint, printExpected, stringify } from 'jest-matcher-utils';
import type { HostElement } from 'test-renderer';

import { checkHostElement, formatMessage } from './utils';

export function toHaveProp(
  this: jest.MatcherContext,
  element: HostElement,
  name: string,
  expectedValue: unknown,
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
          secondArgument: isExpectedValueDefined ? printExpected(expectedValue) : undefined,
        },
      );
      return formatMessage(
        matcher,
        `Expected element ${to} have prop`,
        formatProp(name, expectedValue),
        'Received',
        hasProp ? formatProp(name, receivedValue) : undefined,
      );
    },
  };
}

function formatProp(name: string, value: unknown) {
  if (value === undefined) {
    return name;
  }

  if (typeof value === 'string') {
    return `${name}="${value}"`;
  }

  return `${name}={${stringify(value)}}`;
}
