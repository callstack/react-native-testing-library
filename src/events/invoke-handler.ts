import type { Fiber, TestInstance } from 'test-renderer';

import { act } from '../act';
import { isInstanceMounted } from '../helpers/component-tree';
import { ErrorWithStack } from '../helpers/errors';

/**
 * Calls a handler prop with the given arguments, in `act()`, and resolves to its return value.
 * Escape hatch for callbacks that no event reaches, like `onContentSizeChange(width, height)`, or
 * `onHoverIn` of `Pressable`, which React Native never calls on iOS or Android by default.
 *
 * Looks up the prop on the element, then on the composite components that render it, nearest
 * first, up to the next host element. Doesn't check whether a device would call the handler:
 * disabled elements, `pointerEvents` and `editable` are ignored.
 *
 * @param handlerName the exact prop name, e.g. `onContentSizeChange`
 */
export async function UNSAFE_invokeHandler(
  instance: TestInstance,
  handlerName: string,
  ...args: unknown[]
): Promise<unknown> {
  if (instance == null) {
    throw new ErrorWithStack(
      `Unable to invoke "${handlerName}". Please provide a host element.`,
      UNSAFE_invokeHandler,
    );
  }

  if (typeof handlerName !== 'string' || handlerName === '') {
    throw new ErrorWithStack(
      'Unable to invoke a handler. Please provide a handler prop name, e.g. "onContentSizeChange".',
      UNSAFE_invokeHandler,
    );
  }

  if (!isInstanceMounted(instance)) {
    throw new ErrorWithStack(
      `Unable to invoke "${handlerName}". The element is unmounted.`,
      UNSAFE_invokeHandler,
    );
  }

  const handler = findHandler(instance, handlerName);
  if (handler == null) {
    throw new ErrorWithStack(
      `Unable to invoke "${handlerName}". No "${handlerName}" function prop found on the element ` +
        `(${instance.type}) or the components that render it (${formatCompositeNames(instance)}).`,
      UNSAFE_invokeHandler,
    );
  }

  return await act(() => handler(...args));
}

type Handler = (...args: unknown[]) => unknown;

function findHandler(instance: TestInstance, handlerName: string): Handler | null {
  const ownHandler = instance.props[handlerName];
  if (typeof ownHandler === 'function') {
    return ownHandler as Handler;
  }

  for (const fiber of getCompositeOwnerFibers(instance)) {
    const handler: unknown = fiber.memoizedProps?.[handlerName];
    if (typeof handler === 'function') {
      return handler as Handler;
    }
  }

  return null;
}

/** Fibers of the composite components that render the element, nearest first. */
function getCompositeOwnerFibers(instance: TestInstance): Fiber[] {
  const fibers: Fiber[] = [];
  let fiber = instance.unstable_fiber?.return ?? null;
  // Stops at the next host element, or at the root container, which has no parent.
  while (fiber?.return != null && typeof fiber.type !== 'string') {
    fibers.push(fiber);
    fiber = fiber.return;
  }

  return fibers;
}

/** E.g. `View, Pressable, MyButton`. */
function formatCompositeNames(instance: TestInstance): string {
  const names = getCompositeOwnerFibers(instance)
    .map((fiber) => getComponentName(fiber.type))
    .filter((name) => name != null);
  return names.length > 0 ? names.join(', ') : 'none';
}

function getComponentName(type: unknown): string | null {
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
