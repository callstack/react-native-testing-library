import { matcherHint, printExpected, stringify } from 'jest-matcher-utils';
import type { TestInstance } from 'test-renderer';

import { checkHostElement, formatMessage } from './utils';

export function toHaveProp(
  this: jest.MatcherContext,
  instance: TestInstance,
  name: string,
  expectedValue: unknown,
) {
  checkHostElement(instance, toHaveProp, this);

  const isExpectedValueDefined = expectedValue !== undefined;
  const hasProp = name in instance.props;
  const receivedValue = instance.props[name];

  const pass = isExpectedValueDefined
    ? hasProp && this.equals(expectedValue, receivedValue)
    : hasProp;

  return {
    pass,
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      const matcher = matcherHint(
        `${this.isNot ? '.not' : ''}.toHaveProp`,
        'instance',
        printExpected(name),
        {
          secondArgument: isExpectedValueDefined ? printExpected(expectedValue) : undefined,
        },
      );
      return formatMessage(
        matcher,
        `Expected instance ${to} have prop`,
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
