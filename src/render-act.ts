import type { ReactTestRenderer } from 'react-test-renderer';
import act from './act';
import { render } from './renderer/renderer';
import { RenderOptions } from './render';
import { getConfig } from './config';

export function renderWithAct(
  component: React.ReactElement,
  _options?: RenderOptions,
): ReactTestRenderer {
  let renderer: ReactTestRenderer;

  // This will be called synchronously.
  void act(() => {
    // @ts-expect-error
    renderer = render(component) as ReactTestRenderer;
  });

  // @ts-ignore act is synchronous, so renderer is already initialized here
  return renderer;
}
