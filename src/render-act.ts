import TestRenderer from 'react-test-renderer';
import type { ReactTestRenderer, TestRendererOptions } from 'react-test-renderer';
import act from './act';

export function renderWithAct(
  component: React.ReactElement,
  options?: Partial<TestRendererOptions>,
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  // This will be called synchronously.
  void act(() => {
    // @ts-expect-error TestRenderer.create is not typed correctly
    renderer = TestRenderer.create(component, options);
  });

  // @ts-ignore act is synchronous, so renderer is already initialized here
  return renderer;
}
