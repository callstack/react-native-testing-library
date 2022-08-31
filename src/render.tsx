import TestRenderer from 'react-test-renderer';
import type { ReactTestInstance, ReactTestRenderer } from 'react-test-renderer';
import * as React from 'react';
import { Profiler } from 'react';
import act from './act';
import { addToCleanupQueue } from './cleanup';
import debugShallow from './helpers/debugShallow';
import debugDeep from './helpers/debugDeep';
import { getQueriesForElement } from './within';
import { setRenderResult, screen } from './screen';
import { assertStringsWithinText } from './helpers/assertStringsWithinText';

export type RenderOptions = {
  wrapper?: React.ComponentType<any>;
  createNodeMock?: (element: React.ReactElement) => any;
  experimentalValidateStringsRenderedInText?: boolean;
};

type TestRendererOptions = {
  createNodeMock: (element: React.ReactElement) => any;
};

export type RenderResult = ReturnType<typeof render>;

type RenderParams<T> = RenderOptions & {
  component: React.ReactElement<T>;
  internalWrap?: (innerElement: React.ReactElement) => React.ReactElement;
};

/**
 * Renders test component deeply using react-test-renderer and exposes helpers
 * to assert on the output.
 */
export function render<T>({
  component,
  wrapper: Wrapper,
  createNodeMock,
  internalWrap = (element) => element,
  experimentalValidateStringsRenderedInText = false,
}: RenderParams<T>) {
  const wrap = (element: React.ReactElement) =>
    Wrapper
      ? internalWrap(<Wrapper>{element}</Wrapper>)
      : internalWrap(element);

  const renderer = renderWithAct(
    wrap(component),
    createNodeMock ? { createNodeMock } : undefined
  );
  const update = updateWithAct(renderer, wrap);
  const instance = renderer.root;

  if (experimentalValidateStringsRenderedInText) {
    assertStringsWithinText(renderer.toJSON());
  }

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
    container: instance,
    rerender: update, // alias for `update`
    toJSON: renderer.toJSON,
    debug: debug(instance, renderer),
  };

  setRenderResult(result);
  return result;
}

export default function renderComponent<T>(
  component: React.ReactElement<T>,
  {
    wrapper: Wrapper,
    createNodeMock,
    experimentalValidateStringsRenderedInText,
  }: RenderOptions = {}
) {
  if (!experimentalValidateStringsRenderedInText) {
    return render({ component, wrapper: Wrapper, createNodeMock });
  }

  const handleRender: React.ProfilerProps['onRender'] = (_, phase) => {
    if (phase === 'update') {
      assertStringsWithinText(screen.toJSON());
    }
  };

  const wrap = (innerElement: React.ReactElement) => (
    <Profiler id="renderProfiler" onRender={handleRender}>
      {innerElement}
    </Profiler>
  );

  return render({
    component,
    wrapper: Wrapper,
    createNodeMock,
    internalWrap: wrap,
    experimentalValidateStringsRenderedInText: true,
  });
}

function renderWithAct(
  component: React.ReactElement,
  options?: TestRendererOptions
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  act(() => {
    renderer = TestRenderer.create(component, options);
  });

  // @ts-ignore act is sync, so renderer is always initialised here
  return renderer;
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

interface DebugFunction {
  (message?: string): void;
  shallow: (message?: string) => void;
}

function debug(
  instance: ReactTestInstance,
  renderer: ReactTestRenderer
): DebugFunction {
  function debugImpl(message?: string) {
    const json = renderer.toJSON();
    if (json) {
      return debugDeep(json, message);
    }
  }
  debugImpl.shallow = (message?: string) => debugShallow(instance, message);
  return debugImpl;
}
