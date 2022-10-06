import type { ReactTestRendererJSON } from 'react-test-renderer';
import prettyFormat, { NewPlugin, plugins } from 'pretty-format';

type FilterNodeByTypeFunction = (
  propName: string,
  propValue: unknown,
  node: ReactTestRendererJSON
) => boolean;

export type FormatOptions = {
  filterProps?: FilterNodeByTypeFunction;
};

const format = (
  input: ReactTestRendererJSON | ReactTestRendererJSON[],
  options: FormatOptions = {}
) =>
  prettyFormat(input, {
    plugins: [getCustomPlugin(options.filterProps)],
    highlight: true,
  });

const getCustomPlugin = (filterProps?: FilterNodeByTypeFunction): NewPlugin => {
  return {
    test: (val) =>
      plugins.ReactTestComponent.test(val) || plugins.ReactElement.test(val),
    serialize: (val, config, indentation, depth, refs, printer) => {
      if (plugins.ReactTestComponent.test(val)) {
        if (filterProps && val.props) {
          Object.keys(val.props).forEach((propName) => {
            if (!filterProps(propName, val.props[propName], val)) {
              delete val.props[propName];
            }
          });
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
