import type { NewPlugin } from 'pretty-format';
import prettyFormat, { plugins } from 'pretty-format';

import type { MapPropsFunction } from './map-props';
import { defaultMapProps } from './map-props';
import { HostNode, JsonNode } from 'universal-test-renderer';

export type FormatElementOptions = {
  /** Minimize used space. */
  compact?: boolean;

  /** Highlight the output. */
  highlight?: boolean;

  /** Filter or map props to display. */
  mapProps?: MapPropsFunction | null;
};

/***
 * Format given element as a pretty-printed string.
 *
 * @param element Element to format.
 */
export function formatElement(
  element: HostNode | null,
  { compact, highlight = true, mapProps = defaultMapProps }: FormatElementOptions = {},
) {
  if (element == null) {
    return '(null)';
  }

  if (typeof element === 'string') {
    return element;
  }

  const { children, ...props } = element.props;
  const childrenToDisplay = element.children.filter((child) => typeof child === 'string');

  return prettyFormat(
    {
      // This prop is needed persuade the prettyFormat that the element is
      // a ReactTestRendererJSON instance, so it is formatted as JSX.
      $$typeof: Symbol.for('react.test.json'),
      type: `${element.type}`,
      props: mapProps ? mapProps(props) : props,
      children: childrenToDisplay,
    },
    // See: https://www.npmjs.com/package/pretty-format#usage-with-options
    {
      plugins: [plugins.ReactTestComponent],
      printFunctionName: false,
      printBasicPrototype: false,
      highlight: highlight,
      min: compact,
    },
  );
}

export function formatElementList(elements: HostNode[], options?: FormatElementOptions) {
  if (elements.length === 0) {
    return '(no elements)';
  }

  return elements.map((element) => formatElement(element, options)).join('\n');
}

export function formatJson(
  json: JsonNode | JsonNode[],
  { compact, highlight = true, mapProps = defaultMapProps }: FormatElementOptions = {},
) {
  return prettyFormat(json, {
    plugins: [getElementJsonPlugin(mapProps), plugins.ReactElement],
    highlight: highlight,
    printBasicPrototype: false,
    min: compact,
  });
}

function getElementJsonPlugin(mapProps?: MapPropsFunction | null): NewPlugin {
  return {
    test: (val) => plugins.ReactTestComponent.test(val),
    serialize: (val, config, indentation, depth, refs, printer) => {
      let newVal = val;
      if (mapProps && val.props) {
        newVal = { ...val, props: mapProps(val.props) };
      }
      return plugins.ReactTestComponent.serialize(
        newVal,
        config,
        indentation,
        depth,
        refs,
        printer,
      );
    },
  };
}
