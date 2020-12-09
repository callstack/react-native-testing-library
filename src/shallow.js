// @flow
import * as React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies
import { throwRemovedFunctionError } from './helpers/errors';

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export function shallowInternal(
  instance: ReactTestInstance | React.Element<any>
): {| output: any |} {
  const renderer = new ShallowRenderer();

  renderer.render(React.createElement(instance.type, instance.props));

  return {
    output: renderer.getRenderOutput(),
  };
}

export default function shallow(_: ReactTestInstance | React.Element<any>) {
  throwRemovedFunctionError(
    'shallow',
    'migration-v2#removed-global-shallow-function'
  );
}
