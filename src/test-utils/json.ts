import type { JsonNode } from 'universal-test-renderer';

type JsonPropsMapper = {
  [key: string]: unknown;
};

export function mapJsonProps<T extends JsonNode | JsonNode[] | null>(
  element: T,
  mapper: JsonPropsMapper,
): T {
  if (Array.isArray(element)) {
    return element.map((e) => mapJsonProps(e, mapper)) as T;
  }

  if (!element) {
    return element;
  }

  const resultProps = { ...element.props };
  Object.keys(mapper).forEach((key) => {
    if (key in element.props) {
      resultProps[key] = mapper[key];
    }
  });

  const resultElement = { ...element, props: resultProps };
  Object.defineProperty(resultElement, '$$typeof', {
    value: Symbol.for('react.test.json'),
  });

  return resultElement;
}
