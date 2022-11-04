import { ReactTestInstance } from 'react-test-renderer';
import { getConfig } from '../config';
import { isInaccessible } from './accessiblity';

interface FindAllOptions {
  hidden?: boolean;
}

export function findAll(
  root: ReactTestInstance,
  predicate: (node: ReactTestInstance) => boolean,
  options?: FindAllOptions
) {
  const results = root.findAll(predicate);

  const hidden = options?.hidden ?? getConfig().defaultHidden;
  if (hidden) {
    return results;
  }

  const cache = new WeakMap<ReactTestInstance>();
  return results.filter((element) => !isInaccessible(element, { cache }));
}
