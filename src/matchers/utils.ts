import {
  EXPECTED_COLOR,
  matcherHint,
  printReceived,
  printWithType,
  RECEIVED_COLOR,
  stringify,
} from 'jest-matcher-utils';
import redent from 'redent';
import type { TestInstance } from 'test-renderer';

import { isTestInstance } from '../helpers/component-tree';

export interface MatcherContext {
  readonly isNot?: boolean;
  readonly equals: (a: unknown, b: unknown) => boolean;
}

export type CustomMatcher = (
  this: MatcherContext,
  ...args: never[]
) => {
  pass: boolean;
  message: () => string;
};

class HostElementTypeError extends Error {
  constructor(received: unknown, matcherFn: CustomMatcher, context: MatcherContext) {
    super();

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn);
    }

    let withType = '';
    try {
      withType = printWithType('Received', received, printReceived);
      /* istanbul ignore next */
    } catch {
      // Deliberately empty.
    }

    this.message = [
      matcherHint(`${context.isNot ? '.not' : ''}.${matcherFn.name}`, 'received', ''),
      '',
      `${RECEIVED_COLOR('received')} value must be a host instance.`,
      withType,
    ].join('\n');
  }
}

/**
 * Throws HostElementTypeError if passed instance is not a host instance.
 *
 * @param instance TestInstance to check.
 * @param matcherFn Matcher function calling the check used for formatting error.
 * @param context Jest matcher context used for formatting error.
 */
export function checkHostElement(
  instance: TestInstance | null | undefined,
  matcherFn: CustomMatcher,
  context: MatcherContext,
): asserts instance is TestInstance {
  if (!isTestInstance(instance)) {
    throw new HostElementTypeError(instance, matcherFn, context);
  }
}

export function formatMessage(
  matcher: string,
  expectedLabel: string,
  expectedValue: string | RegExp | null | undefined,
  receivedLabel: string,
  receivedValue: string | null | undefined,
) {
  return [
    `${matcher}\n`,
    `${expectedLabel}:\n${EXPECTED_COLOR(redent(formatValue(expectedValue), 2))}`,
    `${receivedLabel}:\n${RECEIVED_COLOR(redent(formatValue(receivedValue), 2))}`,
  ].join('\n');
}

function formatValue(value: unknown) {
  return typeof value === 'string' ? value : stringify(value);
}
