// @flow
import * as React from 'react';
import TestRenderer from 'react-test-renderer'; // eslint-disable-line import/no-extraneous-dependencies
import { getByAPI } from './helpers/getByAPI';
import { queryByAPI } from './helpers/queryByAPI';

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export default function render(
  component: React.Element<*>,
  options?: { createNodeMock: (element: React.Element<*>) => any }
) {
  const renderer = TestRenderer.create(component, options);
  const instance = renderer.root;

  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    update: renderer.update,
    unmount: renderer.unmount,
    toJSON: renderer.toJSON,
  };
}
