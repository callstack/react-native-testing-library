import { Container, Instance, TextInstance } from './reconciler';

export type HostNode = HostElement | string;
export type HostElementProps = Record<string, unknown>;

type FindOptions = {
  deep?: boolean;
};

const instanceToHostElementMap = new WeakMap<Container | Instance, HostElement>();

export class HostElement {
  public type: string;
  public props: HostElementProps;
  public children: HostNode[];

  constructor(type: string, props: HostElementProps, children: HostNode[]) {
    this.type = type;
    this.props = props;
    this.children = children;
  }

  static fromContainer(container: Container): HostElement {
    const hostElement = instanceToHostElementMap.get(container);
    if (hostElement) {
      return hostElement;
    }

    const result = new HostElement(
      'ROOT',
      {},
      container.children.map((child) => HostElement.fromInstance(child)),
    );

    instanceToHostElementMap.set(container, result);
    return result;
  }

  static fromInstance(instance: Instance | TextInstance): HostNode {
    switch (instance.tag) {
      case 'TEXT':
        return instance.text;

      case 'INSTANCE': {
        const hostElement = instanceToHostElementMap.get(instance);
        if (hostElement) {
          return hostElement;
        }

        const result = new HostElement(
          instance.type,
          instance.props,
          instance.children.map((child) => HostElement.fromInstance(child)),
        );

        instanceToHostElementMap.set(instance, result);
        return result;
      }

      default:
        // @ts-expect-error
        throw new Error(`Unexpected node type in toJSON: ${instance.tag}`);
    }
  }

  findAll(predicate: (element: HostElement) => boolean, options?: FindOptions): HostElement[] {
    return findAll(this, predicate, options);
  }
}

function findAll(
  root: HostElement,
  predicate: (element: HostElement) => boolean,
  options?: FindOptions,
): HostElement[] {
  const deep = options?.deep ?? true;
  const results = [];

  if (predicate(root)) {
    results.push(root);
    if (!deep) {
      return results;
    }
  }

  root.children.forEach((child) => {
    if (typeof child === 'string') {
      return;
    }

    results.push(...findAll(child, predicate, options));
  });

  return results;
}
