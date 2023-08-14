import { ReactTestInstance } from 'react-test-renderer';
import {
  RECEIVED_COLOR,
  matcherHint,
  printWithType,
  printReceived,
} from 'jest-matcher-utils';
import prettyFormat, { plugins } from 'pretty-format';
import redent from 'redent';

class ReactElementTypeError extends Error {
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
    } catch (e) {
      // Deliberately empty.
    }

    /* istanbul ignore next */
    this.message = [
      matcherHint(
        `${context.isNot ? '.not' : ''}.${matcherFn.name}`,
        'received',
        ''
      ),
      '',
      `${RECEIVED_COLOR('received')} value must be a React Element.`,
      withType,
    ].join('\n');
  }
}

export function printElement(element: ReactTestInstance | null) {
  if (element == null) {
    return 'null';
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

export function checkReactElement(
  element: ReactTestInstance | null | undefined,
  matcherFn: jest.CustomMatcher,
  context: jest.MatcherContext
): asserts element is ReactTestInstance {
  if (!element) {
    throw new ReactElementTypeError(element, matcherFn, context);
  }

  // @ts-expect-error internal _fiber property of ReactTestInstance
  if (!element._fiber && !VALID_ELEMENTS.includes(element.type.toString())) {
    throw new ReactElementTypeError(element, matcherFn, context);
  }
}
