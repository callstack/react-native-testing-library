import { CONTAINER_TYPE } from './contants';
import { Container, Instance, TextInstance } from './reconciler';
import { JsonNode, renderToJson } from './render-to-json';

export type HostNode = HostElement | string;
export type HostElementProps = Record<string, any>;

const instanceToHostElementMap = new WeakMap<Container | Instance, HostElement>();

export class HostElement {
  private instance: Instance | Container;

  constructor(instance: Instance | Container) {
    this.instance = instance;
  }

  get type(): string {
    return this.instance.tag === 'INSTANCE' ? this.instance.type : CONTAINER_TYPE;
  }

  get props(): HostElementProps {
    if (this.instance.tag === 'CONTAINER') {
      return {};
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { children, ...restProps } = this.instance.props;
    return restProps;
  }

  get children(): HostNode[] {
    const result = this.instance.children
      .filter((child) => !child.isHidden)
      .map((child) => HostElement.fromInstance(child));
    return result;
  }

  get parent(): HostElement | null {
    const parentInstance = this.instance.parent;
    if (parentInstance == null) {
      return null;
    }

    if (parentInstance.tag === 'CONTAINER') {
      return HostElement.fromContainer(parentInstance);
    }

    if (parentInstance.tag === 'INSTANCE') {
      return HostElement.fromInstance(parentInstance) as HostElement;
    }

    // @ts-expect-error
    throw new Error(`Unexpected node type in HostElement.parent: ${this.parentInstance.tag}`);
  }

  get $$typeof(): Symbol {
    return Symbol.for('react.test.json');
  }

  toJSON(): JsonNode | null {
    return renderToJson(this.instance);
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
}
