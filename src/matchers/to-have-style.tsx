import type { ReactTestInstance } from 'react-test-renderer';
import { matcherHint, diff } from 'jest-matcher-utils';
import {
  ImageStyle,
  StyleProp,
  StyleSheet,
  TextStyle,
  ViewStyle,
} from 'react-native';
import chalk from 'chalk'; // eslint-disable-line import/no-extraneous-dependencies
import { checkHostElement } from './utils';

export type Style = TextStyle | ViewStyle | ImageStyle;
type StyleLike = Record<string, unknown>;

function printoutStyles(style: StyleLike) {
  return Object.keys(style)
    .sort()
    .map((prop) =>
      Array.isArray(style[prop])
        ? `${prop}: ${JSON.stringify(style[prop], null, 2)};`
        : `${prop}: ${style[prop]};`
    )
    .join('\n');
}

/**
 * Narrows down the properties in received to those with counterparts in expected
 */
function narrow(expected: StyleLike, received: StyleLike) {
  return Object.keys(received)
    .filter((prop) => expected[prop])
    .reduce(
      (obj, prop) =>
        Object.assign(obj, {
          [prop]: received[prop],
        }),
      {}
    );
}

// Highlights only style rules that were expected but were not found in the
// received computed styles
function expectedDiff(expected: StyleLike, received: StyleLike) {
  const receivedNarrow = narrow(expected, received);

  const diffOutput = diff(
    printoutStyles(expected),
    printoutStyles(receivedNarrow)
  );
  // Remove the "+ Received" annotation because this is a one-way diff
  return diffOutput?.replace(`${chalk.red('+ Received')}\n`, '') ?? '';
}

export function toHaveStyle(
  this: jest.MatcherContext,
  element: ReactTestInstance,
  style: StyleProp<Style>
) {
  checkHostElement(element, toHaveStyle, this);

  const expected = (StyleSheet.flatten(style) ?? {}) as StyleLike;
  const received = (StyleSheet.flatten(element.props.style) ?? {}) as StyleLike;

  const pass = Object.entries(expected).every(([prop, value]) =>
    this.equals(received?.[prop], value)
  );

  return {
    pass,
    message: () => {
      const matcher = `${this.isNot ? '.not' : ''}.toHaveStyle`;
      return [
        matcherHint(matcher, 'element', ''),
        expectedDiff(expected, received),
      ].join('\n\n');
    },
  };
}
