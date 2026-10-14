import type { TestInstance } from 'test-renderer';

import { act } from '../act';
import { isInstanceMounted } from '../helpers/component-tree';
import { ErrorWithStack } from '../helpers/errors';
import { getComponentName, getCompositeOwnerFibers } from '../helpers/fiber';
import type { EventHandler } from './shared/types';

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

/** Checks the element's props, then its composite owners' props, up to the next host element. */
function findHandler(instance: TestInstance, handlerName: string): EventHandler | null {
  const ownHandler = instance.props[handlerName];
  if (typeof ownHandler === 'function') {
    return ownHandler as EventHandler;
  }

  for (const fiber of getCompositeOwnerFibers(instance)) {
    const handler: unknown = fiber.memoizedProps?.[handlerName];
    if (typeof handler === 'function') {
      return handler as EventHandler;
    }
  }

  return null;
}

/** E.g. `View, Pressable, MyButton`. */
function formatCompositeNames(instance: TestInstance): string {
  const names = getCompositeOwnerFibers(instance)
    .map((fiber) => getComponentName(fiber.type))
    .filter((name) => name != null);
  return names.length > 0 ? names.join(', ') : 'none';
}
