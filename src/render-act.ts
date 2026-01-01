import type { Root, RootOptions } from 'universal-test-renderer';
import { createRoot } from 'universal-test-renderer';

import act from './act';

export function renderWithAct(element: React.ReactElement, options?: RootOptions): Root {
  const root = createRoot(options);

  // This will be called synchronously.
  void act(() => {
    root.render(element);
  });

  return root;
}

export async function renderWithAsyncAct(
  element: React.ReactElement,
  options?: RootOptions,
): Promise<Root> {
  const root = createRoot(options);

  // eslint-disable-next-line require-await
  await act(async () => {
    root.render(element);
  });

  return root;
}
