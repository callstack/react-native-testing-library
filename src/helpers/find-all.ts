import type { ContainerElement, HostElement } from 'universal-test-renderer';
import { findAll as findAllInternal } from 'universal-test-renderer';

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
  root: ContainerElement | HostElement,
  predicate: (element: HostElement) => boolean,
  options?: FindAllOptions,
): HostElement[] {
  const results = findAllInternal(root, predicate, options);

  const includeHiddenElements =
    options?.includeHiddenElements ?? options?.hidden ?? getConfig()?.defaultIncludeHiddenElements;

  if (includeHiddenElements) {
    return results;
  }

  const cache = new WeakMap<HostElement>();
  return results.filter((element) => !isHiddenFromAccessibility(element, { cache }));
}
