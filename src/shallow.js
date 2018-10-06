// @flow
import * as React from 'react';
import { isValidElementType } from 'react-is';
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export default function shallow(
  instance: ReactTestInstance | React.Element<*>
) {
  const renderer = new ShallowRenderer();
  if (isValidElementType(instance)) {
    // $FlowFixMe - instance is React.Element<*> in this branch
    renderer.render(instance);
  } else {
    renderer.render(React.createElement(instance.type, instance.props));
  }
  const output = renderer.getRenderOutput();

  return {
    output,
  };
}
