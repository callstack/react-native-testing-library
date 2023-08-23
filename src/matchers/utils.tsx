import { ReactTestInstance } from 'react-test-renderer';
import {
  EXPECTED_COLOR,
  RECEIVED_COLOR,
  matcherHint,
  printWithType,
  printReceived,
  stringify,
} from 'jest-matcher-utils';
import prettyFormat, { plugins } from 'pretty-format';
import redent from 'redent';
import { isHostElement } from '../helpers/component-tree';

class HostElementTypeError extends Error {
  constructor(
    received: unknown,
    matcherFn: jest.CustomMatcher,
    context: jest.MatcherContext
  ) {
    super();

    /* istanbul ignore next */
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, matcherFn);
    }

    let withType = '';
    try {
      withType = printWithType('Received', received, printReceived);
      /* istanbul ignore next */
    } catch (e) {
      // Deliberately empty.
    }

    this.message = [
      matcherHint(
        `${context.isNot ? '.not' : ''}.${matcherFn.name}`,
        'received',
        ''
      ),
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
  context: jest.MatcherContext
): asserts element is ReactTestInstance {
  if (!isHostElement(element)) {
    throw new HostElementTypeError(element, matcherFn, context);
  }
}

/***
 * Format given element as a pretty-printed string.
 *
 * @param element Element to format.
 */
export function formatElement(element: ReactTestInstance | null) {
  if (element == null) {
    return '  null';
  }

  return redent(
    prettyFormat(
      {
        // This prop is needed persuade the prettyFormat that the element is
        // a ReactTestRendererJSON instance, so it is formatted as JSX.
        $$typeof: Symbol.for('react.test.json'),
        type: element.type,
        props: element.props,
      },
      {
        plugins: [plugins.ReactTestComponent, plugins.ReactElement],
        printFunctionName: false,
        printBasicPrototype: false,
        highlight: true,
      }
    ),
    2
  );
}

export function formatElementArray(elements: ReactTestInstance[]) {
  if (elements.length === 0) {
    return '  (no elements)';
  }

  return redent(elements.map(formatElement).join('\n'), 2);
}

export function formatMessage(
  matcher: string,
  expectedLabel: string,
  expectedValue: string | RegExp,
  receivedLabel: string,
  receivedValue: string | null
) {
  return [
    `${matcher}\n`,
    `${expectedLabel}:\n${EXPECTED_COLOR(
      redent(formatValue(expectedValue), 2)
    )}`,
    `${receivedLabel}:\n${RECEIVED_COLOR(
      redent(formatValue(receivedValue), 2)
    )}`,
  ].join('\n');
}

function formatValue(value: unknown) {
  return typeof value === 'string' ? value : stringify(value);
}

export function getType({ type }: ReactTestInstance) {
  // @ts-expect-error: ReactTestInstance contains too loose typing
  return type.displayName || type.name || type;
}
