import prettyFormat, { NewPlugin, plugins } from 'pretty-format';
import { JsonElement, JsonNode } from 'universal-test-renderer';

export type MapPropsFunction = (
  props: Record<string, unknown>,
  node: JsonElement,
) => Record<string, unknown>;

export type FormatOptions = {
  mapProps?: MapPropsFunction;
};

const format = (input: JsonNode | JsonNode[], options: FormatOptions = {}) =>
  prettyFormat(input, {
    plugins: [getCustomPlugin(options.mapProps), plugins.ReactElement],
    highlight: true,
    printBasicPrototype: false,
  });

const getCustomPlugin = (mapProps?: MapPropsFunction): NewPlugin => {
  return {
    test: (val) => plugins.ReactTestComponent.test(val),
    serialize: (val, config, indentation, depth, refs, printer) => {
      let newVal = val;
      if (mapProps && val.props) {
        newVal = { ...val, props: mapProps(val.props, val) };
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
};

export default format;
