import type { ReactTestRendererJSON } from 'react-test-renderer';
import prettyFormat, { NewPlugin, plugins } from 'pretty-format';

type MapPropsFunction = (
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
    plugins: [getCustomPlugin(options.mapProps)],
    highlight: true,
  });

const getCustomPlugin = (mapProps?: MapPropsFunction): NewPlugin => {
  return {
    test: (val) =>
      plugins.ReactTestComponent.test(val) || plugins.ReactElement.test(val),
    serialize: (val, config, indentation, depth, refs, printer) => {
      if (plugins.ReactTestComponent.test(val)) {
        if (mapProps && val.props) {
          val.props = mapProps(val.props, val);
        }
        return plugins.ReactTestComponent.serialize(
          val,
          config,
          indentation,
          depth,
          refs,
          printer
        );
      }

      return plugins.ReactElement.serialize(
        val,
        config,
        indentation,
        depth,
        refs,
        printer
      );
    },
  };
};

export default format;
