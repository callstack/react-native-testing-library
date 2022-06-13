import * as React from 'react';
import { ReactTestInstance } from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export function shallowInternal(
  instance: ReactTestInstance | React.ReactElement<any>
): { output: any } {
  const renderer = new (ShallowRenderer as any)();

  renderer.render(React.createElement(instance.type, instance.props));

  return {
    output: renderer.getRenderOutput(),
  };
}
