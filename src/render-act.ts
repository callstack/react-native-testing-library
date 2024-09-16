import TestRenderer from 'react-test-renderer';
import type { ReactTestRenderer } from 'react-test-renderer';
import act from './act';
import { render } from './renderer/renderer';
import { RenderOptions } from './render';
import { getConfig } from './config';

export function renderWithAct(
  component: React.ReactElement,
  options?: RenderOptions,
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  const rendererOption = options?.renderer ?? getConfig().renderer;

  // This will be called synchronously.
  void act(() => {
    if (rendererOption == 'internal') {
      // @ts-expect-error
      renderer = render(component) as ReactTestRenderer;
    } else {
      // @ts-expect-error TestRenderer.create is not typed correctly
      renderer = TestRenderer.create(component, options);
    }
  });

  // @ts-ignore act is synchronous, so renderer is already initialized here
  return renderer;
}
