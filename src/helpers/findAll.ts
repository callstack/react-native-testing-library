import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { isHiddenFromAccessibility } from './accessiblity';

interface FindAllOptions {
  hidden?: boolean;
  includeHiddenElements?: boolean;
}

export function findAll(
  root: ReactTestInstance,
  predicate: (node: ReactTestInstance) => boolean,
  options?: FindAllOptions
) {
  const results = root.findAll(predicate);
  const includeHiddenElementsQueryOption =
    options?.includeHiddenElements ?? options?.hidden;
  const defaultIncludeHiddenElements =
    getConfig()?.defaultIncludeHiddenElements ?? getConfig()?.defaultHidden;

  const hidden =
    includeHiddenElementsQueryOption ?? defaultIncludeHiddenElements;
  if (hidden) {
    return results;
  }

  const cache = new WeakMap<ReactTestInstance>();
  return results.filter(
    (element) => !isHiddenFromAccessibility(element, { cache })
  );
}
