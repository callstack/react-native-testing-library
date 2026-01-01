import * as React from 'react';
import type { HostElement, Root, RootOptions } from 'universal-test-renderer';
import { createRoot } from 'universal-test-renderer';

import act from './act';
import { addToCleanupQueue } from './cleanup';
import { getConfig } from './config';
import type { DebugOptions } from './helpers/debug';
import { debug } from './helpers/debug';
import { HOST_TEXT_NAMES } from './helpers/host-component-names';
import { setRenderResult } from './screen';
import { getQueriesForElement } from './within';

export interface RenderOptions {
  /**
   * Pass a React Component as the wrapper option to have it rendered around the inner element. This is most useful for creating
   * reusable custom render functions for common data providers.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement) => object;
}

export type RenderResult = ReturnType<typeof render>;

const createRootOptions: RootOptions = {
  textComponents: HOST_TEXT_NAMES,
  containerType: 'RntlContainer',
};

/**
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export function render<T>(element: React.ReactElement<T>, options: RenderOptions = {}) {
  const { wrapper: Wrapper } = options || {};

  const wrap = (element: React.ReactElement) => (Wrapper ? <Wrapper>{element}</Wrapper> : element);
  const renderer = createRoot({
    ...createRootOptions,
    createNodeMock: options?.createNodeMock,
  });
  void act(() => {
    renderer.render(wrap(element));
  });

  return buildRenderResult(renderer, wrap);
}

function buildRenderResult(
  renderer: Root,
  wrap: (element: React.ReactElement) => React.JSX.Element,
) {
  const update = (element: React.ReactElement) => {
    void act(() => {
      renderer.render(wrap(element));
    });
  };

  const unmount = () => {
    void act(() => {
      renderer.unmount();
    });
  };

  addToCleanupQueue(unmount);

  const result = {
    ...getQueriesForElement(renderer.container),
    update,
    unmount,
    rerender: update, // alias for `update`
    toJSON: () => renderer.container?.toJSON(),
    debug: makeDebug(renderer),
    get container(): HostElement {
      return renderer.container;
    },
    get root(): HostElement | null {
      return renderer.root;
    },
  };

  setRenderResult(result);
  return result;
}

export type DebugFunction = (options?: DebugOptions) => void;

function makeDebug(renderer: Root): DebugFunction {
  function debugImpl(options?: DebugOptions) {
    const { defaultDebugOptions } = getConfig();
    const debugOptions = { ...defaultDebugOptions, ...options };
    const json = renderer.root?.toJSON();
    if (json) {
      return debug(json, debugOptions);
    }
  }

  return debugImpl;
}
