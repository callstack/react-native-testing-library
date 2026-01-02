import type { ImageStyle, StyleProp, TextStyle, ViewStyle } from 'react-native';
import { StyleSheet } from 'react-native';
import { diff, matcherHint } from 'jest-matcher-utils';
import type { HostElement } from 'universal-test-renderer';

import { checkHostElement, formatMessage } from './utils';

export type Style = ViewStyle | TextStyle | ImageStyle;

type StyleLike = Record<string, unknown>;

export function toHaveStyle(
  this: jest.MatcherContext,
  element: HostElement,
  style: StyleProp<Style>,
) {
  checkHostElement(element, toHaveStyle, this);

  const expected = (StyleSheet.flatten(style) as StyleLike) ?? {};
  const received = (StyleSheet.flatten(element.props.style) as StyleLike) ?? {};

  const pass = Object.keys(expected).every((key) => this.equals(expected[key], received[key]));

  return {
    pass,
    message: () => {
      const to = this.isNot ? 'not to' : 'to';
      const matcher = matcherHint(`${this.isNot ? '.not' : ''}.toHaveStyle`, 'element', '');

      if (pass) {
        return formatMessage(
          matcher,
          `Expected element ${to} have style`,
          formatStyles(expected),
          'Received',
          formatStyles(pickReceivedStyles(expected, received)),
        );
      } else {
        return [matcher, '', expectedDiff(expected, received)].join('\n');
      }
    },
  };
}

/**
 * Generate diff between `expected` and `received` styles.
 */
function expectedDiff(expected: StyleLike, received: StyleLike) {
  const receivedNarrow = pickReceivedStyles(expected, received);
  return diff(formatStyles(expected), formatStyles(receivedNarrow));
}

/**
 * Pick from `received` style only the keys present in `expected` style.
 */
function pickReceivedStyles(expected: StyleLike, received: StyleLike) {
  const result: StyleLike = {};
  Object.keys(received).forEach((key) => {
    if (expected[key] !== undefined) {
      result[key] = received[key];
    }
  });

  return result;
}

function formatStyles(style: StyleLike) {
  return Object.keys(style)
    .sort()
    .map((prop) => `${prop}: ${JSON.stringify(style[prop], null, 2)};`)
    .join('\n');
}
