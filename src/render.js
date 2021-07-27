// @flow
import * as React from 'react';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer'; // eslint-disable-line import/no-extraneous-dependencies
import act from './act';
import { addToCleanupQueue } from './cleanup';
import { getByAPI, type GetByAPI } from './helpers/getByAPI';
import { queryByAPI, type QueryByAPI } from './helpers/queryByAPI';
import { findByAPI, type FindByAPI } from './helpers/findByAPI';
import { a11yAPI, type A11yAPI } from './helpers/a11yAPI';
import debugShallow from './helpers/debugShallow';
import debugDeep from './helpers/debugDeep';

type Options = {
  wrapper?: React.ComponentType<any>,
  createNodeMock?: (element: React.Element<any>) => any,
  respectAccessibilityProps?: boolean,
};
type TestRendererOptions = {
  createNodeMock: (element: React.Element<any>) => any,
};

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export default function render<T>(
  component: React.Element<T>,
  { wrapper: Wrapper, createNodeMock, respectAccessibilityProps }: Options = {}
): {
  ...FindByAPI,
  ...QueryByAPI,
  ...GetByAPI,
  ...A11yAPI,
  update: (component: React.Element<any>) => void,
  container: ReactTestInstance,
  rerender: (component: React.Element<any>) => void,
  unmount: (nextElement?: React.Element<any>) => void,
  toJSON: () => null | ReactTestRendererJSON,
  debug: DebugFunction,
} {
  const wrap = (innerElement: React.Element<any>) =>
    Wrapper ? <Wrapper>{innerElement}</Wrapper> : innerElement;

  const renderer = renderWithAct(
    wrap(component),
    createNodeMock ? { createNodeMock } : undefined
    // respectAccessibilityProps
  );
  const update = updateWithAct(renderer, wrap);
  const instance = respectAccessibilityProps
    ? appendFindAllTrap(renderer)
    : renderer.root;
  const unmount = () => {
    act(() => {
      renderer.unmount();
    });
  };

  addToCleanupQueue(unmount);

  return {
    ...getByAPI(instance),
    ...queryByAPI(instance),
    ...findByAPI(instance),
    ...a11yAPI(instance),
    update,
    unmount,
    container: instance,
    rerender: update, // alias for `update`
    toJSON: renderer.toJSON,
    debug: debug(instance, renderer),
  };
}

function renderWithAct(
  component: React.Element<any>,
  options?: TestRendererOptions
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  act(() => {
    renderer = TestRenderer.create(component, options);
  });

  return ((renderer: any): ReactTestRenderer);
}

function updateWithAct(
  renderer: ReactTestRenderer,
  wrap: (innerElement: React.Element<any>) => React.Element<any>
) {
  return function (component: React.Element<any>) {
    act(() => {
      renderer.update(wrap(component));
    });
  };
}

interface DebugFunction {
  (message?: string): void;
  shallow: (message?: string) => void;
}

function debug(
  instance: ReactTestInstance,
  renderer: ReactTestRenderer
): DebugFunction {
  function debugImpl(message?: string) {
    return debugDeep(renderer.toJSON(), message);
  }
  debugImpl.shallow = (message) => debugShallow(instance, message);
  return debugImpl;
}

function appendFindAllTrap(renderer: ReactTestRenderer) {
  return new Proxy(renderer.root, {
    get(target, prop) {
      const isFindAllProp = prop === 'findAll';
      const newFindAll = (fn, node = target) => {
        if (node.props.accessibilityElementsHidden) {
          return [];
        }

        const initial = fn(node) ? [node] : [];

        return node.children.reduce((result, child) => {
          if (typeof child === 'string') {
            return result;
          }

          return result.concat(newFindAll(fn, child));
        }, initial);
      };

      return isFindAllProp ? newFindAll : Reflect.get(...arguments);
    },
  });
}
