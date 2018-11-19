// @flow
import prettyFormat, { plugins } from 'pretty-format';

const format = (input: ?ReactTestRendererJSON) =>
  prettyFormat(input, {
    plugins: [plugins.ReactTestComponent, plugins.ReactElement],
    highlight: true,
  });

export default format;
