import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import * as React from 'react';
import { Profiler } from 'react';
import act from './act';
import { addToCleanupQueue } from './cleanup';
import { getConfig } from './config';
import { getHostChildren } from './helpers/component-tree';
import debugDeep, { DebugOptions } from './helpers/debugDeep';
import debugShallow from './helpers/debugShallow';
import { configureHostComponentNamesIfNeeded } from './helpers/host-component-names';
import { validateStringsRenderedWithinText } from './helpers/stringValidation';
import { renderWithAct } from './render-act';
import { setRenderResult, screen } from './screen';
import { getQueriesForElement } from './within';

export interface RenderOptions {
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement) => any;
  unstable_validateStringsRenderedWithinText?: boolean;
}

export type RenderResult = ReturnType<typeof render>;

/**
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export default function render<T>(
  component: React.ReactElement<T>,
  options: RenderOptions = {}
) {
  return renderInternal(component, options);
}

export interface RenderInternalOptions extends RenderOptions {
  detectHostComponentNames?: boolean;
}

export function renderInternal<T>(
  component: React.ReactElement<T>,
  {
    wrapper: Wrapper,
    createNodeMock,
    unstable_validateStringsRenderedWithinText,
    detectHostComponentNames = true,
  }: RenderInternalOptions = {}
) {
  if (detectHostComponentNames) {
    configureHostComponentNamesIfNeeded();
  }

  if (unstable_validateStringsRenderedWithinText) {
    return renderWithStringValidation(component, {
      wrapper: Wrapper,
      createNodeMock,
    });
  }

  const wrap = (element: React.ReactElement) =>
    Wrapper ? <Wrapper>{element}</Wrapper> : element;

  const renderer = renderWithAct(
    wrap(component),
    createNodeMock ? { createNodeMock } : undefined
  );

  return buildRenderResult(renderer, wrap);
}

function renderWithStringValidation<T>(
  component: React.ReactElement<T>,
  {
    wrapper: Wrapper,
    createNodeMock,
  }: Omit<RenderOptions, 'unstable_validateStringsRenderedWithinText'> = {}
) {
  const handleRender: React.ProfilerProps['onRender'] = (_, phase) => {
    if (phase === 'update') {
      validateStringsRenderedWithinText(screen.toJSON());
    }
  };

  const wrap = (element: React.ReactElement) => (
    <Profiler id="renderProfiler" onRender={handleRender}>
      {Wrapper ? <Wrapper>{element}</Wrapper> : element}
    </Profiler>
  );

  const renderer = renderWithAct(
    wrap(component),
    createNodeMock ? { createNodeMock } : undefined
  );
  validateStringsRenderedWithinText(renderer.toJSON());

  return buildRenderResult(renderer, wrap);
}

function buildRenderResult(
  renderer: ReactTestRenderer,
  wrap: (element: React.ReactElement) => JSX.Element
) {
  const update = updateWithAct(renderer, wrap);
  const instance = renderer.root;

  const unmount = () => {
    act(() => {
      renderer.unmount();
    });
  };

  addToCleanupQueue(unmount);

  const result = {
    ...getQueriesForElement(instance),
    update,
    unmount,
    rerender: update, // alias for `update`
    toJSON: renderer.toJSON,
    debug: debug(instance, renderer),
    get root() {
      return getHostChildren(instance)[0];
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
          "Consider using 'root' property which returns root host element."
      );
    },
  });

  setRenderResult(result);
  return result;
}

function updateWithAct(
  renderer: ReactTestRenderer,
  wrap: (innerElement: React.ReactElement) => React.ReactElement
) {
  return function (component: React.ReactElement) {
    act(() => {
      renderer.update(wrap(component));
    });
  };
}

export interface DebugFunction {
  (options?: DebugOptions | string): void;
  shallow: (message?: string) => void;
}

function debug(
  instance: ReactTestInstance,
  renderer: ReactTestRenderer
): DebugFunction {
  function debugImpl(options?: DebugOptions | string) {
    const { defaultDebugOptions } = getConfig();
    const debugOptions =
      typeof options === 'string'
        ? { ...defaultDebugOptions, message: options }
        : { ...defaultDebugOptions, ...options };

    if (typeof options === 'string') {
      // eslint-disable-next-line no-console
      console.warn(
        'Using debug("message") is deprecated and will be removed in future release, please use debug({ message; "message" }) instead.'
      );
    }

    const json = renderer.toJSON();
    if (json) {
      return debugDeep(json, debugOptions);
    }
  }
  debugImpl.shallow = (message?: string) => debugShallow(instance, message);
  return debugImpl;
}
