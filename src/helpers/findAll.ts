import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { isHiddenFromAccessibility } from './accessiblity';

interface FindAllOptions {
  hidden?: boolean;
  includeHidden?: boolean;
}

export function findAll(
  root: ReactTestInstance,
  predicate: (node: ReactTestInstance) => boolean,
  options?: FindAllOptions
) {
  const results = root.findAll(predicate);
  const includeHiddenQueryOption = options?.includeHidden ?? options?.hidden;
  const hidden = includeHiddenQueryOption ?? getConfig().defaultHidden;
  if (hidden) {
    return results;
  }

  const cache = new WeakMap<ReactTestInstance>();
  return results.filter(
    (element) => !isHiddenFromAccessibility(element, { cache })
  );
}
