// @flow
import * as React from 'react';
import prettyFormat, { plugins } from 'pretty-format'; // eslint-disable-line import/no-extraneous-dependencies
import shallow from './shallow';

/**
 * Log pretty-printed shallow test component instance
 */
export default function debug(
  instance: ReactTestInstance | React.Element<*>,
  message?: any
) {
  const { output } = shallow(instance);
  // eslint-disable-next-line no-console
  console.log(format(output), message || '');
}

const format = input =>
  prettyFormat(input, {
    plugins: [plugins.ReactTestComponent, plugins.ReactElement],
  });
