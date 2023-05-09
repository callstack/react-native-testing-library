import type { ReactTestRendererJSON } from 'react-test-renderer';
import prettyFormat, { NewPlugin, plugins } from 'pretty-format';

export type MapPropsFunction = (
  props: Record<string, unknown>,
  node: ReactTestRendererJSON
) => Record<string, unknown>;

export type FormatOptions = {
  mapProps?: MapPropsFunction;
};

const format = (
  input: ReactTestRendererJSON | ReactTestRendererJSON[],
  options: FormatOptions = {}
) =>
  prettyFormat(input, {
    plugins: [getCustomPlugin(options.mapProps), plugins.ReactElement],
    highlight: shouldHighlight(),
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
        printer
      );
    },
  };
};

function shouldHighlight() {
  return process?.env?.COLORS !== 'false';
}

export default format;
