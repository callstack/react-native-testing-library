import type { Fiber, TestInstance } from 'test-renderer';

/** Fibers of the composite components that render the element, nearest first. */
export function getCompositeOwnerFibers(instance: TestInstance): Fiber[] {
  const fibers: Fiber[] = [];
  let fiber = instance.unstable_fiber?.return ?? null;
  // Stops at the next host element, or at the root container, which has no parent.
  while (fiber?.return != null && typeof fiber.type !== 'string') {
    fibers.push(fiber);
    fiber = fiber.return;
  }

  return fibers;
}

/** Display name of a component type, e.g. `Pressable`, unwrapping `memo()` and `forwardRef()`. */
export function getComponentName(type: unknown): string | null {
  if (typeof type === 'function') {
    const component = type as { displayName?: string; name?: string };
    return component.displayName || component.name || null;
  }

  if (type != null && typeof type === 'object') {
    // `memo()` and `forwardRef()` wrap the component in `type` or `render`.
    const wrapper = type as { displayName?: string; type?: unknown; render?: unknown };
    return wrapper.displayName || getComponentName(wrapper.type ?? wrapper.render);
  }

  return null;
}
