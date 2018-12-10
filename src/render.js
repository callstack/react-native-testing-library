// @flow
import * as React from 'react';
import TestRenderer from 'react-test-renderer'; // eslint-disable-line import/no-extraneous-dependencies
import { getByAPI } from './helpers/getByAPI';
import { queryByAPI } from './helpers/queryByAPI';
import debugShallow from './helpers/debugShallow';
import debugDeep from './helpers/debugDeep';

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export default function render(
  component: React.Element<any>,
  options?: { createNodeMock: (element: React.Element<any>) => any }
) {
  const renderer = TestRenderer.create(component, options);
  const instance = renderer.root;

  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    update: renderer.update,
    unmount: renderer.unmount,
    toJSON: renderer.toJSON,
    debug: debug(instance, renderer),
  };
}

function debug(instance: ReactTestInstance, renderer) {
  function debugImpl(message?: string) {
    return debugDeep(renderer.toJSON(), message);
  }
  debugImpl.shallow = message => debugShallow(instance, message);
  return debugImpl;
}
