// @flow
import * as React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies
import { printDeprecationWarning } from './helpers/errors';

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export function shallowInternal(
  instance: ReactTestInstance | React.Element<any>
) {
  const renderer = new ShallowRenderer();

  renderer.render(React.createElement(instance.type, instance.props));

  return {
    output: renderer.getRenderOutput(),
  };
}

export default function shallow(
  instance: ReactTestInstance | React.Element<any>
) {
  printDeprecationWarning('shallow');

  return shallowInternal(instance);
}
