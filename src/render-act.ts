import TestRenderer from 'react-test-renderer';
import type { ReactTestRenderer, TestRendererOptions } from 'react-test-renderer';

export function renderWithAct(
  component: React.ReactElement,
  options?: TestRendererOptions
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  // This will be called synchronously.
  void TestRenderer.act(() => {
    renderer = TestRenderer.create(component, options);
  });

  // @ts-ignore act is synchronous, so renderer is already initialised here
  return renderer;
}
