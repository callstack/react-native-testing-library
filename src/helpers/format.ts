import type { ReactTestRendererJSON } from 'react-test-renderer';
import type { NewPlugin } from 'pretty-format';
import prettyFormat, { plugins } from 'pretty-format';

export type MapPropsFunction = (
  props: Record<string, unknown>,
  node: ReactTestRendererJSON,
) => Record<string, unknown>;

export type FormatOptions = {
  mapProps?: MapPropsFunction;
};

const format = (
  input: ReactTestRendererJSON | ReactTestRendererJSON[],
  options: FormatOptions = {},
) =>
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
