import React from 'react';
import { View } from 'react-native';
import { render } from '../..';
import { formatElement, checkHostElement } from '../utils';

function fakeMatcher() {
  // Do nothing.
}

test('formatElement', () => {
  expect(formatElement(null)).toMatchInlineSnapshot(`"null"`);
});

test('checkHostElement allows host element', () => {
  const screen = render(<View testID="view" />);

  expect(() => {
    // @ts-expect-error
    checkHostElement(screen.getByTestId('view'), fakeMatcher, {});
  }).not.toThrow();
});

test('checkHostElement allows rejects composite element', () => {
  const screen = render(<View testID="view" />);

  expect(() => {
    // @ts-expect-error
    checkHostElement(screen.UNSAFE_root, fakeMatcher, {});
  }).toThrow(/value must be a host element./);
});

test('checkHostElement allows rejects null element', () => {
  expect(() => {
    // @ts-expect-error
    checkHostElement(null, fakeMatcher, {});
  }).toThrowErrorMatchingInlineSnapshot(`
    "expect(received).fakeMatcher()

    received value must be a host element.
    Received has value: null"
  `);
});
