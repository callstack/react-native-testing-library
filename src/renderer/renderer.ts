import { ReactElement } from 'react';
import { Container, Instance, TestReconciler, TextInstance } from './reconciler';

export function render(element: ReactElement) {
  const container: Container = {
    tag: 'CONTAINER',
    children: [],
    createNodeMock: () => null,
  };

  const root = TestReconciler.createContainer(
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

  TestReconciler.updateContainer(element, root, null, () => {
    // eslint-disable-next-line no-console
    console.log('Rendered', container.children);
  });

  const toJSON = () => {
    if (root?.current == null || container == null) {
      return null;
    }

    if (container.children.length === 0) {
      return null;
    }

    if (container.children.length === 1) {
      return toJson(container.children[0]);
    }

    if (
      container.children.length === 2 &&
      container.children[0].isHidden === true &&
      container.children[1].isHidden === false
    ) {
      // Omit timed out children from output entirely, including the fact that we
      // temporarily wrap fallback and timed out children in an array.
      return toJson(container.children[1]);
    }

    let renderedChildren = null;
    if (container.children?.length) {
      for (let i = 0; i < container.children.length; i++) {
        const renderedChild = toJson(container.children[i]);
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

  return {
    toJSON,
  };
}

type ToJsonNode = ToJsonInstance | string;

type ToJsonInstance = {
  type: string;
  props: object;
  children: Array<ToJsonNode> | null;
  $$typeof: Symbol;
};

function toJson(instance: Instance | TextInstance): ToJsonNode | null {
  if (instance.isHidden) {
    // Omit timed out children from output entirely. This seems like the least
    // surprising behavior. We could perhaps add a separate API that includes
    // them, if it turns out people need it.
    return null;
  }

  switch (instance.tag) {
    case 'TEXT':
      return instance.text;

    case 'INSTANCE': {
      // We don't include the `children` prop in JSON.
      // Instead, we will include the actual rendered children.
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, ...props } = instance.props;

      let renderedChildren = null;
      if (instance.children?.length) {
        for (let i = 0; i < instance.children.length; i++) {
          const renderedChild = toJson(instance.children[i]);
          if (renderedChild !== null) {
            if (renderedChildren === null) {
              renderedChildren = [renderedChild];
            } else {
              renderedChildren.push(renderedChild);
            }
          }
        }
      }

      const result = {
        type: instance.type,
        props: props,
        children: renderedChildren,
        $$typeof: Symbol.for('react.test.json'),
      };
      Object.defineProperty(result, '$$typeof', {
        value: Symbol.for('react.test.json'),
      });
      return result;
    }

    default:
      // @ts-expect-error
      throw new Error(`Unexpected node type in toJSON: ${inst.tag}`);
  }
}
