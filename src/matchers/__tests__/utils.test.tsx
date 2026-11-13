import React from 'react';
import { View } from 'react-native';

import * as matchers from '..';
import { render, screen } from '../..';
import type { CustomMatcher, MatcherContext } from '../utils';
import { checkHostElement } from '../utils';

function fakeMatcher() {
  return { pass: true, message: () => 'fake' };
}

test('checkHostElement allows host element', async () => {
  await render(<View testID="view" />);

  expect(() => {
    // @ts-expect-error: intentionally passing wrong element shape
    checkHostElement(screen.getByTestId('view'), fakeMatcher, {});
  }).not.toThrow();
});

test('checkHostElement allows rejects null element', () => {
  expect(() => {
    // @ts-expect-error: intentionally passing wrong element shape
    checkHostElement(null, fakeMatcher, {});
  }).toThrowErrorMatchingInlineSnapshot(`
    "expect(received).fakeMatcher()

    received value must be a host instance.
    Received has value: null"
  `);
});

test('matchers accept minimal MatcherContext', async () => {
  const validMatchers: Record<keyof typeof matchers, CustomMatcher> = matchers;
  const context: MatcherContext = { equals: Object.is };

  await render(<View testID="view" style={{ width: 100 }} />);
  const element = screen.getByTestId('view');

  expect(validMatchers).toBe(matchers);
  expect(matchers.toHaveStyle.call(context, element, { width: 100 }).pass).toBe(true);
  expect(matchers.toBeVisible.call({ ...context, isNot: false }, element).pass).toBe(true);
});
