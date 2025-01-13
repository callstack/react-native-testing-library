import type { ReactTestInstance } from 'react-test-renderer';
import {
  EXPECTED_COLOR,
  matcherHint,
  printReceived,
  printWithType,
  RECEIVED_COLOR,
  stringify,
} from 'jest-matcher-utils';
import redent from 'redent';
import { isHostElement } from '../helpers/component-tree';

class HostElementTypeError extends Error {
  constructor(received: unknown, matcherFn: jest.CustomMatcher, context: jest.MatcherContext) {
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
      `${RECEIVED_COLOR('received')} value must be a host element.`,
      withType,
    ].join('\n');
  }
}

/**
 * Throws HostElementTypeError if passed element is not a host element.
 *
 * @param element ReactTestInstance to check.
 * @param matcherFn Matcher function calling the check used for formatting error.
 * @param context Jest matcher context used for formatting error.
 */
export function checkHostElement(
  element: ReactTestInstance | null | undefined,
  matcherFn: jest.CustomMatcher,
  context: jest.MatcherContext,
): asserts element is ReactTestInstance {
  if (!isHostElement(element)) {
    throw new HostElementTypeError(element, matcherFn, context);
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
