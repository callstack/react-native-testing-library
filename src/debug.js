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
function debugDeep(
  instance: React.Element<*> | ?ReactTestRendererJSON,
  message?: any = ''
) {
  try {
    // We're assuming React.Element<*> here and fallback to
    // rendering ?ReactTestRendererJSON
    // $FlowFixMe
    const { toJSON } = render(instance);
    console.log(format(toJSON()), message);
  } catch (e) {
    console.log(format(instance), message);
  }
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
