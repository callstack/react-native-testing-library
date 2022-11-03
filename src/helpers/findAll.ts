import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { AccessibilityOption } from '../queries/options';
import { isInaccessible } from './accessiblity';

export function findAll<Options extends AccessibilityOption>(
  instance: ReactTestInstance,
  predicate: (node: ReactTestInstance) => boolean,
  options?: Options
) {
  const results = instance.findAll(predicate);

  const hidden = options?.hidden ?? getConfig().hidden; // We will want to add `defaultHidden: boolean` option to `configure`

  if (hidden) {
    return results;
  }

  const subtreeIsInaccessibleCache = new WeakMap<ReactTestInstance>();

  return results.filter(
    (result) =>
      !isInaccessible(result, {
        cache: subtreeIsInaccessibleCache,
      })
  );
}
