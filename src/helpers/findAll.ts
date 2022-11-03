import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { BaseOptions } from '../queries/options';
import { isInaccessible } from './accessiblity';

export function findAll(
  instance: ReactTestInstance,
  predicate: (node: ReactTestInstance) => boolean,
  options?: BaseOptions
) {
  const results = instance.findAll(predicate);

  const hidden = options?.hidden ?? getConfig().hidden; // We will want to add `defaultHidden: boolean` option to `configure`

  if (hidden) {
    return results;
  }

  const cache = new WeakMap<ReactTestInstance>();
  return results.filter((element) => !isInaccessible(element, { cache }));
}
