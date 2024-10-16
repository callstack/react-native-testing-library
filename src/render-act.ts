import act from './act';
import { render, RenderResult } from './renderer/renderer';
import { RenderOptions } from './render';

export function renderWithAct(
  component: React.ReactElement,
  _options?: RenderOptions,
): RenderResult {
  let renderer: RenderResult;

  // This will be called synchronously.
  void act(() => {
    renderer = render(component);
  });

  // @ts-ignore act is synchronous, so renderer is already initialized here
  return renderer;
}
