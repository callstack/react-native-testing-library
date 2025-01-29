import React from 'react';
import { View } from 'react-native';

import { render, screen } from '../..';
import { checkHostElement } from '../utils';

function fakeMatcher() {
  return { pass: true, message: () => 'fake' };
}

test('checkHostElement allows host element', () => {
  render(<View testID="view" />);

  expect(() => {
    // @ts-expect-error: intentionally passing wrong element shape
    checkHostElement(screen.getByTestId('view'), fakeMatcher, {});
  }).not.toThrow();
});

test('checkHostElement allows rejects composite element', () => {
  render(<View testID="view" />);

  expect(() => {
    // @ts-expect-error: intentionally passing wrong element shape
    checkHostElement(screen.UNSAFE_root, fakeMatcher, {});
  }).toThrow(/value must be a host element./);
});

test('checkHostElement allows rejects null element', () => {
  expect(() => {
    // @ts-expect-error: intentionally passing wrong element shape
    checkHostElement(null, fakeMatcher, {});
  }).toThrowErrorMatchingInlineSnapshot(`
    "expect(received).fakeMatcher()

    received value must be a host element.
    Received has value: null"
  `);
});
