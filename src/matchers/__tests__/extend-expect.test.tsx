import * as React from 'react';
import { View } from 'react-native';

// Note: that must point to root of the /src to reliably replicate default import.
import { configure, render } from '../..';

beforeEach(() => {
  configure({ renderer: 'internal' });
});

// This is check that RNTL does not extend "expect" by default, until we actually want to expose Jest matchers publically.
test('does not extend "expect" by default', () => {
  render(<View />);

  // @ts-expect-error
  expect(expect.toBeOnTheScreen).toBeUndefined();
});
