import { ReactTestInstance } from 'react-test-renderer';

/**
 * Checks if the given instance is a host component.
 * @param node The node to check.
 */
export function isHostComponent(node: ReactTestInstance): boolean {
  return typeof node.type === 'string';
}

/**
 * Returns first host ancestor for given node.
 * @param node The node start traversing from.
 */
export function getHostParent(
  node: ReactTestInstance | null
): ReactTestInstance | null {
  if (node == null) {
    return null;
  }

  if (isHostComponent(node)) {
    return node;
  }

  return getHostParent(node.parent);
}

/**
 * Returns first host ancestor for given node.
 * @param node The node start traversing from.
 */
export function getHostChildren(
  node: ReactTestInstance | null
): ReactTestInstance[] {
  if (node == null) {
    return [];
  }

  const hostChildren: ReactTestInstance[] = [];

  node.children.forEach((child) => {
    if (typeof child === 'string') {
      return;
    }

    if (isHostComponent(child)) {
      hostChildren.push(child);
    } else if (typeof child !== 'string') {
      hostChildren.push(...getHostChildren(child));
    }
  });

  return hostChildren;
}
