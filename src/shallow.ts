import * as React from 'react';
import ShallowRenderer from 'react-test-renderer/shallow'; // eslint-disable-line import/no-extraneous-dependencies
import { HostElement } from './renderer/host-element';

/**
 * Renders test component shallowly using react-test-renderer/shallow
 */
export function shallowInternal(instance: HostElement | React.ReactElement<any>): {
  output: any;
} {
  const renderer = new (ShallowRenderer as any)();

  renderer.render(React.createElement(instance.type, instance.props));

  return {
    output: renderer.getRenderOutput(),
  };
}
