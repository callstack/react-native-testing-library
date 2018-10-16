// @flow
/* eslint-disable no-console */
import * as React from 'react';
import prettyFormat, { plugins } from 'pretty-format'; // eslint-disable-line import/no-extraneous-dependencies
import shallow from './shallow';
import render from './render';

/**
 * Log pretty-printed shallow test component instance
 */
function debugShallow(
  instance: ReactTestInstance | React.Element<*>,
  message?: any
) {
  const { output } = shallow(instance);

  console.log(format(output), message || '');
}

/**
 * Log pretty-printed deep test component instance
 */
function debugDeep(instance: React.Element<*>, message?: any) {
  const { toJSON } = render(instance);

  console.log(format(toJSON()), message || '');
}

const format = input =>
  prettyFormat(input, {
    plugins: [plugins.ReactTestComponent, plugins.ReactElement],
    highlight: true,
  });

const debug = debugShallow;

debug.shallow = debugShallow;
debug.deep = debugDeep;

export default debug;
