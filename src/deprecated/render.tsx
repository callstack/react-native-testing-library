import * as React from 'react';
import type { HostElement, JsonElement, Root, RootOptions } from 'universal-test-renderer';

import act from '../act';
import { addToCleanupQueue } from '../cleanup';
import { getConfig } from '../config';
import type { DebugOptions } from '../helpers/debug';
import { debug } from '../helpers/debug';
import { renderWithAct } from '../render-act';
import { setRenderResult } from '../screen';
import { getQueriesForElement } from '../within';

export interface DeprecatedRenderOptions {
  /**
   * Pass a React Component as the wrapper option to have it rendered around the inner element. This is most useful for creating
   * reusable custom render functions for common data providers.
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  wrapper?: React.ComponentType<any>;

  createNodeMock?: (element: React.ReactElement) => unknown;
}

/**
 * @deprecated Use `render` (async) instead. This function is provided for migration purposes only.
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export default function deprecated_renderSync<T>(
  component: React.ReactElement<T>,
  options: DeprecatedRenderOptions = {},
) {
  return renderInternal(component, options);
}

export type DeprecatedRenderResult = ReturnType<typeof deprecated_renderSync>;

export function renderInternal<T>(
  component: React.ReactElement<T>,
  options?: DeprecatedRenderOptions,
) {
  const { wrapper: Wrapper } = options || {};

  // TODO allow passing some options
  const rendererOptions: RootOptions = {};

  const wrap = (element: React.ReactElement) => (Wrapper ? <Wrapper>{element}</Wrapper> : element);
  const renderer = renderWithAct(wrap(component), rendererOptions);
  return buildRenderResult(renderer, wrap);
}

function buildRenderResult(
  renderer: Root,
  wrap: (element: React.ReactElement) => React.JSX.Element,
) {
  const rerender = (component: React.ReactElement) => {
    void act(() => {
      renderer.render(wrap(component));
    });
  };
  const rerenderAsync = async (component: React.ReactElement) => {
    // eslint-disable-next-line require-await
    await act(async () => {
      renderer.render(wrap(component));
    });
  };

  const unmount = () => {
    void act(() => {
      renderer.unmount();
    });
  };
  const unmountAsync = async () => {
    // eslint-disable-next-line require-await
    await act(async () => {
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

  addToCleanupQueue(unmountAsync);

  const result = {
    ...getQueriesForElement(renderer.container),
    rerender,
    rerenderAsync,
    update: rerender, // alias for 'rerender'
    updateAsync: rerenderAsync, // alias for `rerenderAsync`
    unmount,
    unmountAsync,
    toJSON,
    debug: makeDebug(renderer),
    get container(): HostElement {
      return renderer.container;
    },
    get root(): HostElement | null {
      const firstChild = renderer.container.children[0];
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
