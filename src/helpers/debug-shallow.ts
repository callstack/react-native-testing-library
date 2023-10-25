import * as React from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import { shallowInternal } from '../shallow';
import format from './format';

/**
 * Log pretty-printed shallow test component instance
 */
export default function debugShallow(
  instance: ReactTestInstance | React.ReactElement<any>,
  message?: string
) {
  const { output } = shallowInternal(instance);

  if (message) {
    // eslint-disable-next-line no-console
    console.log(`${message}\n\n`, format(output));
  } else {
    // eslint-disable-next-line no-console
    console.log(format(output));
  }
}
