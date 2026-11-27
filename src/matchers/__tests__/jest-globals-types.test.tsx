// `@jest/globals` ships with `jest`.
// eslint-disable-next-line import/no-extraneous-dependencies
import { expect, test } from '@jest/globals';
import * as React from 'react';
import { Text } from 'react-native';

import { render, screen } from '../..';

// Another augmentation of `expect`, as libraries like `expo-router/testing-library` add. It must
// not drop the built-in matcher types from the `@jest/globals` `expect`. `yarn typecheck` checks it.
declare module 'expect' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface Matchers<R extends void | Promise<void>, T = unknown> {
    toBeTestOnlyMatcher(): R;
  }
}

test('built-in matchers are typed on the @jest/globals expect', async () => {
  await render(<Text>Hello</Text>);

  const element = screen.getByText('Hello');
  expect(element).toBeOnTheScreen();
  expect(element).toHaveTextContent('Hello');
  expect(element).not.toBeDisabled();
});
