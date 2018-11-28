// @flow
import * as React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export default function shallow(
  instance: ReactTestInstance | React.Element<any>
) {
  const renderer = new ShallowRenderer();

  renderer.render(React.createElement(instance.type, instance.props));

  return {
    output: renderer.getRenderOutput(),
  };
}
