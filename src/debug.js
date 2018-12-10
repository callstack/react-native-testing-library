// @flow
/* eslint-disable no-console */
import * as React from 'react';
import render from './render';
import debugShallow from './helpers/debugShallow';
import debugDeep from './helpers/debugDeep';
import format from './helpers/format';

/**
 * Log pretty-printed deep test component instance
 */
function debugDeepElementOrInstance(
  instance: React.Element<any> | ?ReactTestRendererJSON,
  message?: any = ''
) {
  try {
    // We're assuming React.Element<any> here and fallback to
    // rendering ?ReactTestRendererJSON
    // $FlowFixMe
    const { toJSON } = render(instance);
    if (message) {
      console.log(`${message}\n\n`, format(toJSON()));
    } else {
      console.log(format(toJSON()));
    }
  } catch (e) {
    // $FlowFixMe
    debugDeep(instance);
  }
}

function debug(
  instance: ReactTestInstance | React.Element<any>,
  message?: any
) {
  return debugShallow(instance, message);
}

debug.shallow = debugShallow;
debug.deep = debugDeepElementOrInstance;

export default debug;
