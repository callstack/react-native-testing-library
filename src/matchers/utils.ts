import type { ElementType } from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import {
  EXPECTED_COLOR,
  matcherHint,
  printReceived,
  printWithType,
  RECEIVED_COLOR,
  stringify,
} from 'jest-matcher-utils';
import prettyFormat, { plugins } from 'pretty-format';
import redent from 'redent';
import { isHostElement } from '../helpers/component-tree';
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

export type FormatElementOptions = {
  // Minimize used space.
  minimal?: boolean;
};

/***
 * Format given element as a pretty-printed string.
 *
 * @param element Element to format.
 */
export function formatElement(
  element: ReactTestInstance | null,
  { minimal = false }: FormatElementOptions = {},
) {
  if (element == null) {
    return '  null';
  }

  const { children, ...props } = element.props;
  const childrenToDisplay = typeof children === 'string' ? [children] : undefined;

  return redent(
    prettyFormat(
      {
        // This prop is needed persuade the prettyFormat that the element is
        // a ReactTestRendererJSON instance, so it is formatted as JSX.
        $$typeof: Symbol.for('react.test.json'),
        type: formatElementType(element.type),
        props: defaultMapProps(props),
        children: childrenToDisplay,
      },
      // See: https://www.npmjs.com/package/pretty-format#usage-with-options
      {
        plugins: [plugins.ReactTestComponent, plugins.ReactElement],
        printFunctionName: false,
        printBasicPrototype: false,
        highlight: true,
        min: minimal,
      },
    ),
    2,
  );
}

export function formatElementType(type: ElementType): string {
  if (typeof type === 'function') {
    return type.displayName ?? type.name;
  }

  // if (typeof type === 'object') {
  //   console.log('OBJECT', type);
  // }

  if (typeof type === 'object' && 'type' in type) {
    // @ts-expect-error: despite typing this can happen
    const nestedType = formatElementType(type.type);
    if (nestedType) {
      return nestedType;
    }
  }

  if (typeof type === 'object' && 'render' in type) {
    // @ts-expect-error: despite typing this can happen
    const nestedType = formatElementType(type.render);
    if (nestedType) {
      return nestedType;
    }
  }

  return `${type}`;
}

export function formatElementArray(elements: ReactTestInstance[], options?: FormatElementOptions) {
  if (elements.length === 0) {
    return '  (no elements)';
  }

  return redent(elements.map((element) => formatElement(element, options)).join('\n'), 2);
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
