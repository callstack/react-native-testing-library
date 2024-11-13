import * as React from 'react';
import { createRoot, HostElement, Renderer } from 'universal-test-renderer/react-native';
import act from './act';
import { addToCleanupQueue } from './cleanup';
import { getConfig } from './config';
import debugDeep, { DebugOptions } from './helpers/debug-deep';
import { configureHostComponentNamesIfNeeded } from './helpers/host-component-names';
import { setRenderResult } from './screen';
import { getQueriesForElement } from './within';

export interface RenderOptions {
  /**
   * Pass a React Component as the wrapper option to have it rendered around the inner element. This is most useful for creating
   *  reusable custom render functions for common data providers.
   */
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement) => object;
}

export type RenderResult = ReturnType<typeof render>;

/**
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export default function render<T>(element: React.ReactElement<T>, options: RenderOptions = {}) {
  return renderInternal(element, options);
}

export interface RenderInternalOptions extends RenderOptions {
  detectHostComponentNames?: boolean;
}

export function renderInternal<T>(element: React.ReactElement<T>, options?: RenderInternalOptions) {
  const { wrapper: Wrapper, detectHostComponentNames = true } = options || {};

  if (detectHostComponentNames) {
    configureHostComponentNamesIfNeeded();
  }

  const wrap = (element: React.ReactElement) => (Wrapper ? <Wrapper>{element}</Wrapper> : element);

  const renderer = createRoot({
    createNodeMock: options?.createNodeMock,
  });
  void act(() => {
    renderer.render(wrap(element));
  });

  return buildRenderResult(renderer, wrap);
}

function buildRenderResult(renderer: Renderer, wrap: (element: React.ReactElement) => JSX.Element) {
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
    toJSON: () => renderer.root?.toJSON(),
    debug: debug(renderer),
    container: renderer.container,
    get root(): HostElement | null {
      return renderer.root;
    },
  };

  setRenderResult(result);
  return result;
}

export type DebugFunction = (options?: DebugOptions | string) => void;

function debug(renderer: Renderer): DebugFunction {
  function debugImpl(options?: DebugOptions | string) {
    const { defaultDebugOptions } = getConfig();
    const debugOptions =
      typeof options === 'string'
        ? { ...defaultDebugOptions, message: options }
        : { ...defaultDebugOptions, ...options };

    if (typeof options === 'string') {
      // eslint-disable-next-line no-console
      console.warn(
        'Using debug("message") is deprecated and will be removed in future release, please use debug({ message; "message" }) instead.',
      );
    }

    const json = renderer.root?.toJSON();
    if (json) {
      return debugDeep(json, debugOptions);
    }
  }

  return debugImpl;
}
