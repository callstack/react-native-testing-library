import { HostComponent } from 'universal-test-renderer';
import { getConfig } from '../config';
import { isHiddenFromAccessibility } from './accessibility';
import { isValidElement } from './component-tree';

interface FindAllOptions {
  /** Match elements hidden from accessibility */
  includeHiddenElements?: boolean;

  /** RTL-compatible alias to `includeHiddenElements` */
  hidden?: boolean;

  /* Exclude any ancestors of deepest matched elements even if they match the predicate */
  matchDeepestOnly?: boolean;
}

export function findAll(
  root: HostComponent,
  predicate: (element: HostComponent) => boolean,
  options?: FindAllOptions,
): HostComponent[] {
  const results = findAllInternal(root, predicate, options);

  const includeHiddenElements =
    options?.includeHiddenElements ?? options?.hidden ?? getConfig()?.defaultIncludeHiddenElements;

  if (includeHiddenElements) {
    return results;
  }

  const cache = new WeakMap<HostComponent>();
  return results.filter((element) => !isHiddenFromAccessibility(element, { cache }));
}

// Extracted from React Test Renderer
// src: https://github.com/facebook/react/blob/8e2bde6f2751aa6335f3cef488c05c3ea08e074a/packages/react-test-renderer/src/ReactTestRenderer.js#L402
function findAllInternal(
  node: HostComponent,
  predicate: (element: HostComponent) => boolean,
  options?: FindAllOptions,
  indent: string = '',
): HostComponent[] {
  const results: HostComponent[] = [];

  //console.log(`${indent} 🟢 findAllInternal`, node.type, node.props);

  // Match descendants first but do not add them to results yet.
  const matchingDescendants: HostComponent[] = [];
  node.children.forEach((child) => {
    if (typeof child === 'string') {
      return;
    }
    matchingDescendants.push(...findAllInternal(child, predicate, options, indent + '  '));
  });

  if (
    // When matchDeepestOnly = true: add current element only if no descendants match
    (!options?.matchDeepestOnly || matchingDescendants.length === 0) &&
    isValidElement(node) &&
    predicate(node)
  ) {
    results.push(node);
  }

  // Add matching descendants after element to preserve original tree walk order.
  results.push(...matchingDescendants);

  return results;
}

export function findAllByProps(
  root: HostComponent,
  props: { [propName: string]: any },
  options?: FindAllOptions,
): HostComponent[] {
  return findAll(root, (element) => matchProps(element, props), options);
}

function matchProps(element: HostComponent, props: { [propName: string]: any }): boolean {
  for (const key in props) {
    if (props[key] !== element.props[key]) {
      return false;
    }
  }
  return true;
}
