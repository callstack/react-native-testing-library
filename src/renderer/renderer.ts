import { ReactElement } from 'react';
import { Container, TestReconciler } from './reconciler';
import { JsonNode, renderToJson } from './render-to-json';
import { HostElement } from './host-element';

export type RenderResult = {
  update: (element: ReactElement) => void;
  unmount: () => void;
  root: HostElement | null;
  toJSON: () => JsonNode | JsonNode[] | null;
};

export function render(element: ReactElement): RenderResult {
  let container: Container | null = {
    tag: 'CONTAINER',
    children: [],
    createNodeMock: () => null,
  };

  let rootFiber = TestReconciler.createContainer(
    container,
    0, // 0 = LegacyRoot, 1 = ConcurrentRoot
    null, // no hydration callback
    false, // isStrictMode
    null, // concurrentUpdatesByDefaultOverride
    'id', // identifierPrefix
    (error) => {
      // eslint-disable-next-line no-console
      console.log('Recoverable Error', error);
    }, // onRecoverableError
    null, // transitionCallbacks
  );

  TestReconciler.updateContainer(element, rootFiber, null, () => {
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
    if (rootFiber == null || container == null) {
      return;
    }

    TestReconciler.updateContainer(element, rootFiber, null, () => {
      // eslint-disable-next-line no-console
      //console.log('Updated', container?.children);
    });
  };

  const unmount = () => {
    if (rootFiber == null || container == null) {
      return;
    }

    TestReconciler.updateContainer(null, rootFiber, null, () => {
      // eslint-disable-next-line no-console
      //console.log('Unmounted', container?.children);
    });

    container = null;
    rootFiber = null;
  };

  const toJSON = () => {
    if (rootFiber == null || container == null || container.children.length === 0) {
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

    let renderedChildren = null;
    if (container.children?.length) {
      for (let i = 0; i < container.children.length; i++) {
        const renderedChild = renderToJson(container.children[i]);
        if (renderedChild !== null) {
          if (renderedChildren === null) {
            renderedChildren = [renderedChild];
          } else {
            renderedChildren.push(renderedChild);
          }
        }
      }
    }

    return renderedChildren;
  };

  const result = {
    update,
    unmount,
    toJSON,
    get root(): HostElement {
      if (rootFiber == null || container == null) {
        throw new Error("Can't access .root on unmounted test renderer");
      }

      return HostElement.fromContainer(container);
    },
  };

  return result;
}
