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
import { HostComponent, HostNode } from 'universal-test-renderer';
import { isValidElement } from '../helpers/component-tree';
import { defaultMapProps } from '../helpers/format-default';

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
 * @param element HostComponent to check.
 * @param matcherFn Matcher function calling the check used for formatting error.
 * @param context Jest matcher context used for formatting error.
 */
export function checkHostElement(
  element: HostComponent | null | undefined,
  matcherFn: jest.CustomMatcher,
  context: jest.MatcherContext,
): asserts element is HostComponent {
  if (!isValidElement(element)) {
    throw new HostElementTypeError(element, matcherFn, context);
  }
}

/***
 * Format given element as a pretty-printed string.
 *
 * @param element Element to format.
 */
export function formatElement(element: HostNode | null) {
  if (element == null) {
    return '  null';
  }

  if (typeof element === 'string') {
    return element;
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { children, ...props } = element.props;

  return redent(
    prettyFormat(
      {
        // This prop is needed persuade the prettyFormat that the element is
        // a ReactTestRendererJSON instance, so it is formatted as JSX.
        $$typeof: Symbol.for('react.test.json'),
        type: element.type,
        props: defaultMapProps(props),
        // TODO: Recursively format children
        children: element.children.filter((child) => typeof child === 'string'),
      },
      {
        plugins: [plugins.ReactTestComponent, plugins.ReactElement],
        printFunctionName: false,
        printBasicPrototype: false,
        highlight: true,
      },
    ),
    2,
  );
}

export function formatElementArray(elements: HostNode[]) {
  if (elements.length === 0) {
    return '  (no elements)';
  }

  return redent(elements.map(formatElement).join('\n'), 2);
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
