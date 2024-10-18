import { ReactElement } from 'react';
import { Container, TestReconciler } from './reconciler';
import { JsonNode, renderChildrenToJson, renderToJson } from './render-to-json';
import { HostElement } from './host-element';

export type RendererOptions = {
  isConcurrent?: boolean;
  createNodeMock?: (element: ReactElement) => unknown;
};

export type Renderer = {
  render: (element: ReactElement) => void;
  unmount: () => void;
  container: HostElement;
  root: HostElement | null;
  toJSON: () => JsonNode | JsonNode[] | null;
};

export function createRenderer(options?: RendererOptions): Renderer {
  let container: Container | null = {
    tag: 'CONTAINER',
    children: [],
    parent: null,
    createNodeMock: options?.createNodeMock ?? (() => null),
  };

  let containerFiber = TestReconciler.createContainer(
    container,
    options?.isConcurrent ? 1 : 0, // 0 = LegacyRoot, 1 = ConcurrentRoot
    null, // no hydration callback
    false, // isStrictMode
    null, // concurrentUpdatesByDefaultOverride
    'id', // identifierPrefix
    (_error) => {}, // onRecoverableError
    null, // transitionCallbacks
  );

  const render = (element: ReactElement) => {
    TestReconciler.updateContainer(element, containerFiber, null, null);
  };

  const unmount = () => {
    if (containerFiber == null || container == null) {
      return;
    }

    TestReconciler.updateContainer(null, containerFiber, null, null);

    container = null;
    containerFiber = null;
  };

  const toJSON = () => {
    if (containerFiber == null || container == null || container.children.length === 0) {
      return null;
    }

    if (container.children.length === 1) {
      return renderToJson(container.children[0]);
    }

    // Taken from React Test Renderer
    // TODO: When could that happen?
    if (
      container.children.length === 2 &&
      container.children[0].isHidden === true &&
      container.children[1].isHidden === false
    ) {
      // Taken from React Test Renderer
      // > Omit timed out children from output entirely, including the fact that we
      // > temporarily wrap fallback and timed out children in an array.
      return renderToJson(container.children[1]);
    }

    return renderChildrenToJson(container.children);
  };

  return {
    render,
    unmount,
    toJSON,
    get root(): HostElement | null {
      if (containerFiber == null || container == null) {
        throw new Error("Can't access .root on unmounted test renderer");
      }

      if (container.children.length === 0) {
        return null;
      }

      const root = HostElement.fromInstance(container.children[0]);
      if (typeof root === 'string') {
        throw new Error('Cannot render string as root element');
      }

      return root;
    },

    get container(): HostElement {
      if (containerFiber == null || container == null) {
        throw new Error("Can't access .container on unmounted test renderer");
      }

      return HostElement.fromContainer(container);
    },
  };
}
