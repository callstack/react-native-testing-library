import { Container, Instance, TextInstance } from './reconciler';

export type JsonNode = JsonInstance | string;

export type JsonInstance = {
  type: string;
  props: object;
  children: Array<JsonNode> | null;
  $$typeof: Symbol;
};

export function renderToJson(instance: Container | Instance | TextInstance): JsonNode | null {
  if (`isHidden` in instance && instance.isHidden) {
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
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { children, ...props } = instance.props;

      let renderedChildren = null;
      if (instance.children?.length) {
        for (let i = 0; i < instance.children.length; i++) {
          const renderedChild = renderToJson(instance.children[i]);
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
      // This is needed for JEST to format snapshot as JSX.
      Object.defineProperty(result, '$$typeof', {
        value: Symbol.for('react.test.json'),
      });
      return result;
    }

    case 'CONTAINER': {
      let renderedChildren = null;
      if (instance.children?.length) {
        for (let i = 0; i < instance.children.length; i++) {
          const renderedChild = renderToJson(instance.children[i]);
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
        type: 'ROOT',
        props: {},
        children: renderedChildren,
        $$typeof: Symbol.for('react.test.json'),
      };
      // This is needed for JEST to format snapshot as JSX.
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
