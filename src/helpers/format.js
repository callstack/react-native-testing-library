// @flow
import prettyFormat, { plugins } from 'pretty-format';

const format = (input: ?ReactTestRendererJSON): typeof prettyFormat =>
  prettyFormat(input, {
    plugins: [plugins.ReactTestComponent, plugins.ReactElement],
    highlight: true,
  });

export default format;
