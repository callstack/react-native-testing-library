// @flow
import * as React from 'react';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer'; // eslint-disable-line import/no-extraneous-dependencies
import act from './act';
import { getByAPI } from './helpers/getByAPI';
import { queryByAPI } from './helpers/queryByAPI';
import debugShallow from './helpers/debugShallow';
import debugDeep from './helpers/debugDeep';

type Options = {
  createNodeMock: (element: React.Element<any>) => any,
};

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export default function render(
  component: React.Element<any>,
  options?: Options
) {
  const renderer = renderWithAct(component, options);

  const instance = renderer.root;

  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    update: updateWithAct(renderer),
    unmount: renderer.unmount,
    toJSON: renderer.toJSON,
    debug: debug(instance, renderer),
  };
}

function renderWithAct(
  component: React.Element<any>,
  options?: Options
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  act(() => {
    renderer = TestRenderer.create(component, options);
  });

  return ((renderer: any): ReactTestRenderer);
}

function updateWithAct(renderer: ReactTestRenderer) {
  return function(component: React.Element<any>) {
    act(() => {
      renderer.update(component);
    });
  };
}

function debug(instance: ReactTestInstance, renderer) {
  function debugImpl(message?: string) {
    return debugDeep(renderer.toJSON(), message);
  }
  debugImpl.shallow = message => debugShallow(instance, message);
  return debugImpl;
}
