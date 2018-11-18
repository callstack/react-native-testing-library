// @flow
/* eslint-disable no-console */
import * as React from 'react';
import prettyFormat, { plugins } from 'pretty-format';
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

  if (message) {
    console.log(`${message}\n\n`, format(output));
  } else {
    console.log(format(output));
  }
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
    if (message) {
      console.log(`${message}\n\n`, format(toJSON()));
    } else {
      console.log(format(toJSON()));
    }
  } catch (e) {
    if (message) {
      console.log(`${message}\n\n`, format(instance));
    } else {
      console.log(format(instance));
    }
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
