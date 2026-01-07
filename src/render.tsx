import * as React from 'react';
import {
  createRoot,
  type HostElement,
  type JsonElement,
  type Root,
  type RootOptions,
} from 'test-renderer';

import { act } from './act';
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

export type RenderResult = Awaited<ReturnType<typeof render>>;

/**
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export async function render<T>(element: React.ReactElement<T>, options: RenderOptions = {}) {
  const { wrapper: Wrapper, createNodeMock } = options || {};

  const rendererOptions: RootOptions = {
    textComponentTypes: HOST_TEXT_NAMES,
    publicTextComponentTypes: ['Text'],
    createNodeMock,
  };

  const wrap = (element: React.ReactElement) => (Wrapper ? <Wrapper>{element}</Wrapper> : element);
  const renderer = createRoot(rendererOptions);

  await act(() => {
    renderer.render(wrap(element));
  });

  const container = renderer.container;

  const rerender = async (component: React.ReactElement) => {
    await act(() => {
      renderer.render(wrap(component));
    });
  };

  const unmount = async () => {
    await act(() => {
      renderer.unmount();
    });
  };

  const toJSON = (): JsonElement | null => {
    const json = renderer.container.toJSON();
    if (json?.children?.length === 0) {
      return null;
    }

    if (json?.children?.length === 1 && typeof json.children[0] !== 'string') {
      return json.children[0];
    }

    return json;
  };

  addToCleanupQueue(unmount);

  const result = {
    ...getQueriesForElement(renderer.container),
    rerender,
    update: rerender, // alias for `rerender`
    unmount,
    toJSON,
    debug: makeDebug(renderer),
    get container(): HostElement {
      return renderer.container;
    },
    get root(): HostElement | null {
      const firstChild = container.children[0];
      if (typeof firstChild === 'string') {
        throw new Error(
          'Invariant Violation: Root element must be a host element. Detected attempt to render a string within the root element.',
        );
      }

      return firstChild;
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
    const json = renderer.container.toJSON();
    if (json) {
      return debug(json, debugOptions);
    }
  }
  return debugImpl;
}
