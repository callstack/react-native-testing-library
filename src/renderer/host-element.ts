import { Container, Instance, TextInstance } from './reconciler';

export type HostNode = HostElement | string;
export type HostElementProps = Record<string, unknown>;

type FindOptions = {
  deep?: boolean;
};

const instanceToHostElementMap = new WeakMap<Container | Instance, HostElement>();

export class HostElement {
  private instance: Instance | Container;

  constructor(instance: Instance | Container) {
    this.instance = instance;
  }

  get type(): string {
    return 'type' in this.instance ? this.instance.type : 'ROOT';
  }

  get props(): HostElementProps {
    return 'props' in this.instance ? this.instance.props : {};
  }

  get children(): HostNode[] {
    console.log('AAAA', this.instance.children);
    const result = this.instance.children.map((child) => HostElement.fromInstance(child));
    console.log('BBBB', result);
    return result;
  }

  get $$typeof(): Symbol {
    return Symbol.for('react.test.json');
  }

  static fromContainer(container: Container): HostElement {
    const hostElement = instanceToHostElementMap.get(container);
    if (hostElement) {
      return hostElement;
    }

    const result = new HostElement(container);
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

        const result = new HostElement(instance);
        instanceToHostElementMap.set(instance, result);
        return result;
      }

      default:
        // @ts-expect-error
        throw new Error(`Unexpected node type in HostElement.fromInstance: ${instance.tag}`);
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
