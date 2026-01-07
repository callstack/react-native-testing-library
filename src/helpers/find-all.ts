import type { HostElement } from 'test-renderer';

import { getConfig } from '../config';
import { isHiddenFromAccessibility } from './accessibility';

interface FindAllOptions {
  /** Match elements hidden from accessibility */
  includeHiddenElements?: boolean;

  /** RTL-compatible alias to `includeHiddenElements` */
  hidden?: boolean;

  /* Exclude any ancestors of deepest matched elements even if they match the predicate */
  matchDeepestOnly?: boolean;
}

export function findAll(
  root: HostElement,
  predicate: (element: HostElement) => boolean,
  options: FindAllOptions = {},
): HostElement[] {
  const { matchDeepestOnly } = options;
  const results = root.queryAll(predicate, { matchDeepestOnly });

  const includeHiddenElements =
    options?.includeHiddenElements ?? options?.hidden ?? getConfig()?.defaultIncludeHiddenElements;

  if (includeHiddenElements) {
    return results;
  }

  const cache = new WeakMap<HostElement>();
  return results.filter((element) => !isHiddenFromAccessibility(element, { cache }));
}
