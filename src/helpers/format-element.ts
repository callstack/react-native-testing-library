import type { NewPlugin } from 'pretty-format';
import prettyFormat, { plugins } from 'pretty-format';
import type { JsonNode, TestInstance } from 'test-renderer';

import type { MapPropsFunction } from './map-props';
import { defaultMapProps } from './map-props';

export type FormatElementOptions = {
  /** Minimize used space. */
  compact?: boolean;

  /** Highlight the output. */
  highlight?: boolean;

  /** Filter or map props to display. */
  mapProps?: MapPropsFunction | null;
};

/***
 * Format given instance as a pretty-printed string.
 *
 * @param instance Instance to format.
 */
export function formatElement(
  instance: TestInstance | null,
  { compact, highlight = true, mapProps = defaultMapProps }: FormatElementOptions = {},
) {
  if (instance == null) {
    return '(null)';
  }

  const { children, ...props } = instance.props;
  const childrenToDisplay = typeof children === 'string' ? [children] : undefined;

  return prettyFormat(
    {
      // This prop is needed persuade the prettyFormat that the element is
      // a JsonNode instance, so it is formatted as JSX.
      $$typeof: Symbol.for('react.test.json'),
      type: `${instance.type}`,
      props: mapProps ? mapProps(props) : props,
      children: childrenToDisplay,
    },
    // See: https://www.npmjs.com/package/pretty-format#usage-with-options
    {
      plugins: [plugins.ReactTestComponent, plugins.ReactElement],
      printFunctionName: false,
      printBasicPrototype: false,
      highlight: highlight,
      min: compact,
    },
  );
}

export function formatElementList(instances: TestInstance[], options?: FormatElementOptions) {
  if (instances.length === 0) {
    return '(no elements)';
  }

  return instances.map((instance) => formatElement(instance, options)).join('\n');
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
