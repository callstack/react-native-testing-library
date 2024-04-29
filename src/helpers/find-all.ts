import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { isHiddenFromAccessibility } from './accessibility';
import { HostTestInstance, isHostElement } from './component-tree';

interface FindAllOptions {
  /** Match elements hidden from accessibility */
  includeHiddenElements?: boolean;

  /** RTL-compatible alias to `includeHiddenElements` */
  hidden?: boolean;

  /* Exclude any ancestors of deepest matched elements even if they match the predicate */
  matchDeepestOnly?: boolean;
}

export function findAll(
  root: ReactTestInstance,
  predicate: (element: ReactTestInstance) => boolean,
  options?: FindAllOptions,
): HostTestInstance[] {
  const results = findAllInternal(root, predicate, options);

  const includeHiddenElements =
    options?.includeHiddenElements ?? options?.hidden ?? getConfig()?.defaultIncludeHiddenElements;

  if (includeHiddenElements) {
    return results;
  }

  const cache = new WeakMap<ReactTestInstance>();
  return results.filter((element) => !isHiddenFromAccessibility(element, { cache }));
}

// Extracted from React Test Renderer
// src: https://github.com/facebook/react/blob/8e2bde6f2751aa6335f3cef488c05c3ea08e074a/packages/react-test-renderer/src/ReactTestRenderer.js#L402
function findAllInternal(
  root: ReactTestInstance,
  predicate: (element: ReactTestInstance) => boolean,
  options?: FindAllOptions,
): HostTestInstance[] {
  const results: HostTestInstance[] = [];

  // Match descendants first but do not add them to results yet.
  const matchingDescendants: HostTestInstance[] = [];
  root.children.forEach((child) => {
    if (typeof child === 'string') {
      return;
    }
    matchingDescendants.push(...findAllInternal(child, predicate, options));
  });

  if (
    // When matchDeepestOnly = true: add current element only if no descendants match
    (!options?.matchDeepestOnly || matchingDescendants.length === 0) &&
    isHostElement(root) &&
    predicate(root)
  ) {
    results.push(root);
  }

  // Add matching descendants after element to preserve original tree walk order.
  results.push(...matchingDescendants);

  return results;
}
