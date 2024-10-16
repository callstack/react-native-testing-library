import { ReactElement } from 'react';
import { Container, TestReconciler } from './reconciler';
import { JsonNode, renderChildrenToJson, renderToJson } from './render-to-json';
import { HostElement } from './host-element';

export type RenderResult = {
  update: (element: ReactElement) => void;
  unmount: () => void;
  container: HostElement;
  root: HostElement;
  toJSON: () => JsonNode | JsonNode[] | null;
};

export function render(element: ReactElement): RenderResult {
  let container: Container | null = {
    tag: 'CONTAINER',
    children: [],
    parent: null,
    createNodeMock: () => null,
  };

  let containerFiber = TestReconciler.createContainer(
    container,
    0, // 0 = LegacyRoot, 1 = ConcurrentRoot
    null, // no hydration callback
    false, // isStrictMode
    null, // concurrentUpdatesByDefaultOverride
    'id', // identifierPrefix
    (_error) => {
      // eslint-disable-next-line no-console
      console.log('Recoverable Error', _error);
    }, // onRecoverableError
    null, // transitionCallbacks
  );

  TestReconciler.updateContainer(element, containerFiber, null, () => {
    // eslint-disable-next-line no-console
    //console.log('Rendered', container?.children);
  });

  //     update(newElement: React$Element<any>) {
  //       if (root == null || root.current == null) {
  //         return;
  //       }
  //       ReactReconciler.updateContainer(newElement, root, null, null);
  //     },

  const update = (element: ReactElement) => {
    if (containerFiber == null || container == null) {
      return;
    }

    TestReconciler.updateContainer(element, containerFiber, null, () => {
      // eslint-disable-next-line no-console
      //console.log('Updated', container?.children);
    });
  };

  const unmount = () => {
    if (containerFiber == null || container == null) {
      return;
    }

    TestReconciler.updateContainer(null, containerFiber, null, () => {
      // eslint-disable-next-line no-console
      //console.log('Unmounted', container?.children);
    });

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

    // TODO: When could that happen?
    if (
      container.children.length === 2 &&
      container.children[0].isHidden === true &&
      container.children[1].isHidden === false
    ) {
      // Omit timed out children from output entirely, including the fact that we
      // temporarily wrap fallback and timed out children in an array.
      return renderToJson(container.children[1]);
    }

    return renderChildrenToJson(container.children);
  };

  const result = {
    update,
    unmount,
    toJSON,
    get container(): HostElement {
      if (containerFiber == null || container == null) {
        throw new Error("Can't access .container on unmounted test renderer");
      }

      return HostElement.fromContainer(container);
    },

    get root(): HostElement {
      if (containerFiber == null || container == null) {
        throw new Error("Can't access .root on unmounted test renderer");
      }

      if (container.children.length === 0) {
        throw new Error("Can't access .root on unmounted test renderer");
      }

      const root = HostElement.fromInstance(container.children[0]);
      if (typeof root === 'string') {
        throw new Error('Cannot render string as root element');
      }

      return root;
    },
  };

  return result;
}
