import type { JsonNode } from 'universal-test-renderer';

type JsonPropsMapper = {
  [key: string]: unknown;
};

export function mapJsonProps<T extends JsonNode | JsonNode[] | null>(
  node: T,
  mapper: JsonPropsMapper,
): T {
  if (Array.isArray(node)) {
    return node.map((e) => mapJsonProps(e, mapper)) as T;
  }

  if (!node || typeof node === 'string') {
    return node;
  }

  const resultProps: Record<string, unknown> = { ...node.props };
  Object.keys(mapper).forEach((key) => {
    if (key in node.props) {
      resultProps[key] = mapper[key];
    }
  });

  // @ts-expect-error: TODO fix type
  const resultElement = { ...node, props: resultProps };
  Object.defineProperty(resultElement, '$$typeof', {
    value: Symbol.for('react.test.json'),
  });

  return resultElement;
}
