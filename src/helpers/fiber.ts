import type { Fiber } from 'test-renderer';

const HOST_ROOT_TAG = 3;

/**
 * Returns the copy of `fiber` that belongs to the committed tree.
 *
 * React keeps two copies of each fiber (`fiber` and `fiber.alternate`) and switches between them
 * on every commit. A fiber's `return` pointer, and the host instance's `unstable_fiber`, can lead to
 * the copy from an earlier commit, whose `memoizedProps` are stale.
 *
 * Based on React's `findCurrentFiberUsingSlowPath`, which `react-reconciler` doesn't export: it walks
 * up both copies until it reaches the root, then checks which root copy is current. Returns `fiber`
 * when it can't decide, e.g. for an unmounted fiber.
 */
export function getCurrentFiber(fiber: Fiber): Fiber {
  const alternate = fiber.alternate;
  if (alternate === null) {
    return fiber;
  }

  let a = fiber;
  let b = alternate;
  for (;;) {
    const parentA = a.return;
    if (parentA === null) {
      break;
    }

    const parentB = parentA.alternate;
    if (parentB === null) {
      // The parent has only one copy, so both copies of the child are its children. Continue from
      // the parent's parent.
      const nextParent = parentA.return;
      if (nextParent === null) {
        break;
      }
      a = b = nextParent;
      continue;
    }

    // Both copies of the parent share their children when React bailed out on them.
    if (parentA.child === parentB.child) {
      return findInChildren(parentA, a, b) === b ? alternate : fiber;
    }

    if (a.return !== b.return) {
      a = parentA;
      b = parentB;
    } else if (isChildOf(parentA, a) || isChildOf(parentB, b)) {
      a = parentA;
      b = parentB;
    } else if (isChildOf(parentA, b) || isChildOf(parentB, a)) {
      a = parentB;
      b = parentA;
    } else {
      return fiber;
    }
  }

  if (a.tag !== HOST_ROOT_TAG) {
    return fiber;
  }

  return (a.stateNode as { current: Fiber }).current === a ? fiber : alternate;
}

function findInChildren(parent: Fiber, a: Fiber, b: Fiber): Fiber | null {
  for (let child = parent.child; child !== null; child = child.sibling) {
    if (child === a || child === b) {
      return child;
    }
  }

  return null;
}

function isChildOf(parent: Fiber, fiber: Fiber): boolean {
  for (let child = parent.child; child !== null; child = child.sibling) {
    if (child === fiber) {
      return true;
    }
  }

  return false;
}
