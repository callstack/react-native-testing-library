import * as React from 'react';
import { Profiler } from 'react';
import act from './act';
import { addToCleanupQueue } from './cleanup';
import { getConfig } from './config';
import debugDeep, { DebugOptions } from './helpers/debug-deep';
import debugShallow from './helpers/debug-shallow';
import { configureHostComponentNamesIfNeeded } from './helpers/host-component-names';
import { validateStringsRenderedWithinText } from './helpers/string-validation';
import { HostElement } from './renderer/host-element';
import { RenderResult as RendererResult } from './renderer/renderer';
import { renderWithAct } from './render-act';
import { setRenderResult } from './screen';
import { getQueriesForElement } from './within';

export interface RenderOptions {
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement) => unknown;
  unstable_validateStringsRenderedWithinText?: boolean;
}

export type RenderResult = ReturnType<typeof render>;

/**
 * Renders test component deeply using React Test Renderer and exposes helpers
 * to assert on the output.
 */
export default function render<T>(component: React.ReactElement<T>, options: RenderOptions = {}) {
  return renderInternal(component, options);
}

export interface RenderInternalOptions extends RenderOptions {
  detectHostComponentNames?: boolean;
}

export function renderInternal<T>(
  component: React.ReactElement<T>,
  options?: RenderInternalOptions,
) {
  const {
    wrapper: Wrapper,
    detectHostComponentNames = true,
    unstable_validateStringsRenderedWithinText,
    ...restOptions
  } = options || {};

  if (detectHostComponentNames) {
    configureHostComponentNamesIfNeeded();
  }

  if (unstable_validateStringsRenderedWithinText) {
    return renderWithStringValidation(component, {
      wrapper: Wrapper,
      ...restOptions,
    });
  }

  const wrap = (element: React.ReactElement) => (Wrapper ? <Wrapper>{element}</Wrapper> : element);
  const renderer = renderWithAct(wrap(component), restOptions);
  return buildRenderResult(renderer, wrap);
}

function renderWithStringValidation<T>(
  component: React.ReactElement<T>,
  options: Omit<RenderOptions, 'unstable_validateStringsRenderedWithinText'> = {},
) {
  let renderer: RendererResult;
  const { wrapper: Wrapper, ...testRendererOptions } = options ?? {};

  const handleRender: React.ProfilerOnRenderCallback = (_, phase) => {
    if (renderer && phase === 'update') {
      validateStringsRenderedWithinText(renderer.toJSON());
    }
  };

  const wrap = (element: React.ReactElement) => (
    <Profiler id="renderProfiler" onRender={handleRender}>
      {Wrapper ? <Wrapper>{element}</Wrapper> : element}
    </Profiler>
  );

  renderer = renderWithAct(wrap(component), testRendererOptions);

  validateStringsRenderedWithinText(renderer.toJSON());

  return buildRenderResult(renderer, wrap);
}

function buildRenderResult(
  renderer: RendererResult,
  wrap: (element: React.ReactElement) => JSX.Element,
) {
  const update = updateWithAct(renderer, wrap);
  const instance = renderer.container ?? renderer.root;

  const unmount = () => {
    void act(() => {
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
    get root(): HostElement {
      return renderer.root;
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

function updateWithAct(
  renderer: RendererResult,
  wrap: (innerElement: React.ReactElement) => React.ReactElement,
) {
  return function (component: React.ReactElement) {
    void act(() => {
      renderer.update(wrap(component));
    });
  };
}

export interface DebugFunction {
  (options?: DebugOptions | string): void;
  shallow: (message?: string) => void;
}

function debug(instance: HostElement, renderer: RendererResult): DebugFunction {
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

    const json = renderer.toJSON();
    if (json) {
      return debugDeep(json, debugOptions);
    }
  }
  debugImpl.shallow = (message?: string) => debugShallow(instance, message);
  return debugImpl;
}
