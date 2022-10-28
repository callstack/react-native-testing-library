import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { AccessibilityOption } from '../queries/accessibilityOption';
import { isInaccessible, isSubtreeInaccessible } from './accessiblity';

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
  function cachedIsSubtreeInaccessible(element: ReactTestInstance | null) {
    if (element === null) {
      return true;
    }

    if (!subtreeIsInaccessibleCache.has(element)) {
      subtreeIsInaccessibleCache.set(element, isSubtreeInaccessible(element));
    }

    return subtreeIsInaccessibleCache.get(element);
  }

  return results.filter(
    (result) =>
      !isInaccessible(result, {
        isSubtreeInaccessible: cachedIsSubtreeInaccessible,
      })
  );
}
