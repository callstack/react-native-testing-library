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

  let current = node.parent;
  while (current) {
    if (isHostComponent(current)) {
      return current;
    }

    current = current.parent;
  }

  return null;
}

/**
 * Returns host children for given node.
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
    if (typeof child !== 'object') {
      return;
    }

    if (isHostComponent(child)) {
      hostChildren.push(child);
    } else {
      hostChildren.push(...getHostChildren(child));
    }
  });

  return hostChildren;
}

/**
 * Return the array of host nodes that represent the passed node.
 *
 * @param node The node start traversing from.
 * @returns If the passed node is a host node, it will return an array containing only that node,
 * if the passed node is a composite node, it will return an array containing its host children (zero, one or many).
 */
export function getHostSelves(
  node: ReactTestInstance | null
): ReactTestInstance[] {
  return typeof node?.type === 'string' ? [node] : getHostChildren(node);
}

/**
 * Returns host siblings for given node.
 * @param node The node start traversing from.
 */
export function getHostSiblings(
  node: ReactTestInstance | null
): ReactTestInstance[] {
  const hostParent = getHostParent(node);
  const hostSelves = getHostSelves(node);
  return getHostChildren(hostParent).filter(
    (sibling) => !hostSelves.includes(sibling)
  );
}
