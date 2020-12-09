// @flow
import * as React from 'react';
import { shallowInternal } from '../shallow';
import format from './format';

/**
 * Log pretty-printed shallow test component instance
 */
export default function debugShallow(
  instance: ReactTestInstance | React.Element<any>,
  message?: string
) {
  const { output } = shallowInternal(instance);

  if (message) {
    console.log(`${message}\n\n`, format(output));
  } else {
    console.log(format(output));
  }
}
