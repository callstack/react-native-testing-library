import * as React from 'react';
import type { HostElement, Root, TestRendererOptions } from 'universal-test-renderer';

import act from './act';
import { addToCleanupQueue } from './cleanup';
import { getConfig } from './config';
import { getHostSelves } from './helpers/component-tree';
import type { DebugOptions } from './helpers/debug';
import { debug } from './helpers/debug';
import { ErrorWithStack } from './helpers/errors';
import { renderWithAsyncAct } from './render-act';
import { setRenderResult } from './screen';
import { getQueriesForElement } from './within';

export interface RenderAsyncOptions {
  /**
   * Pass a React Component as the wrapper option to have it rendered around the inner element. This is most useful for creating
   * reusable custom render functions for common data providers.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper?: React.ComponentType<any>;

  createNodeMock?: (element: React.ReactElement) => unknown;
}

export type RenderAsyncResult = ReturnType<typeof renderAsync>;

/**
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export default async function renderAsync<T>(
  component: React.ReactElement<T>,
  options: RenderAsyncOptions = {},
) {
  const { wrapper: Wrapper, ...rest } = options || {};

  const testRendererOptions: TestRendererOptions = {
    ...rest,
  };

  const wrap = (element: React.ReactElement) => (Wrapper ? <Wrapper>{element}</Wrapper> : element);
  const renderer = await renderWithAsyncAct(wrap(component), testRendererOptions);
  return buildRenderResult(renderer, wrap);
}

function buildRenderResult(
  renderer: Root,
  wrap: (element: React.ReactElement) => React.JSX.Element,
) {
  const instance = renderer.root;

  const rerender = (_component: React.ReactElement) => {
    throw new ErrorWithStack(
      '"rerender(...)" is not supported when using "renderAsync" use "await rerenderAsync(...)" instead',
      rerender,
    );
  };
  const rerenderAsync = async (component: React.ReactElement) => {
    // eslint-disable-next-line require-await
    await act(async () => {
      renderer.update(wrap(component));
    });
  };

  const unmount = () => {
    throw new ErrorWithStack(
      '"unmount()" is not supported when using "renderAsync" use "await unmountAsync()" instead',
      unmount,
    );
  };
  const unmountAsync = async () => {
    // eslint-disable-next-line require-await
    await act(async () => {
      renderer.unmount();
    });
  };

  addToCleanupQueue(unmountAsync);

  const result = {
    ...getQueriesForElement(instance),
    rerender,
    rerenderAsync,
    update: rerender, // alias for `rerender`
    updateAsync: rerenderAsync, // alias for `rerenderAsync`
    unmount,
    unmountAsync,
    toJSON: renderer.toJSON,
    debug: makeDebug(renderer),
    get root(): HostElement {
      return getHostSelves(instance)[0];
    },
    UNSAFE_root: instance,
  };

  // Add as non-enumerable property, so that it's safe to enumerate
  // `render` result, e.g. using destructuring rest syntax.
  Object.defineProperty(result, 'container', {
    enumerable: false,
    get() {
      throw new Error(
        "'container' property has been renamed to 'UNSAFE_root'.\n\n" +
          "Consider using 'root' property which returns root host element.",
      );
    },
  });

  setRenderResult(result);

  return result;
}

export type DebugFunction = (options?: DebugOptions) => void;

function makeDebug(renderer: Root): DebugFunction {
  function debugImpl(options?: DebugOptions) {
    const { defaultDebugOptions } = getConfig();
    const debugOptions = { ...defaultDebugOptions, ...options };
    const json = renderer.toJSON();
    if (json) {
      return debug(json, debugOptions);
    }
  }
  return debugImpl;
}
