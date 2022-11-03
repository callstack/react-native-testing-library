import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { CommonQueryOptions } from '../queries/options';
import { isInaccessible } from './accessiblity';

export function findAll(
  root: ReactTestInstance,
  predicate: (node: ReactTestInstance) => boolean,
  options?: CommonQueryOptions
) {
  const results = root.findAll(predicate);

  const hidden = options?.hidden ?? getConfig().hidden; // We will want to add `defaultHidden: boolean` option to `configure`

  if (hidden) {
    return results;
  }

  const cache = new WeakMap<ReactTestInstance>();
  return results.filter((element) => !isInaccessible(element, { cache }));
}
