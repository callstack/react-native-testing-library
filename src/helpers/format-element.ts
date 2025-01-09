import type { ElementType } from 'react';
import type { ReactTestInstance } from 'react-test-renderer';
import prettyFormat, { plugins } from 'pretty-format';
import { defaultMapProps } from './format-default';

export type FormatElementOptions = {
  // Minimize used space.
  minimal?: boolean;
};

/***
 * Format given element as a pretty-printed string.
 *
 * @param element Element to format.
 */
export function formatElement(
  element: ReactTestInstance | null,
  { minimal = false }: FormatElementOptions = {},
) {
  if (element == null) {
    return 'null';
  }

  const { children, ...props } = element.props;
  const childrenToDisplay = typeof children === 'string' ? [children] : undefined;

  return prettyFormat(
    {
      // This prop is needed persuade the prettyFormat that the element is
      // a ReactTestRendererJSON instance, so it is formatted as JSX.
      $$typeof: Symbol.for('react.test.json'),
      type: formatElementType(element.type),
      props: defaultMapProps(props),
      children: childrenToDisplay,
    },
    // See: https://www.npmjs.com/package/pretty-format#usage-with-options
    {
      plugins: [plugins.ReactTestComponent, plugins.ReactElement],
      printFunctionName: false,
      printBasicPrototype: false,
      highlight: true,
      min: minimal,
    },
  );
}

export function formatElementType(type: ElementType): string {
  if (typeof type === 'function') {
    return type.displayName ?? type.name;
  }

  // if (typeof type === 'object') {
  //   console.log('OBJECT', type);
  // }

  if (typeof type === 'object' && 'type' in type) {
    // @ts-expect-error: despite typing this can happen for class components, e.g. HOCs
    const nestedType = formatElementType(type.type);
    if (nestedType) {
      return nestedType;
    }
  }

  if (typeof type === 'object' && 'render' in type) {
    // @ts-expect-error: despite typing this can happen for class components, e.g. HOCs
    const nestedType = formatElementType(type.render);
    if (nestedType) {
      return nestedType;
    }
  }

  return `${type}`;
}

export function formatElementList(elements: ReactTestInstance[], options?: FormatElementOptions) {
  if (elements.length === 0) {
    return '(no elements)';
  }

  return elements.map((element) => formatElement(element, options)).join('\n');
}
