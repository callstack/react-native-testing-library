import type { ReactTestRendererJSON } from 'react-test-renderer';
import prettyFormat, { plugins } from 'pretty-format';

const format = (input: ReactTestRendererJSON | ReactTestRendererJSON[]) =>
  prettyFormat(input, {
    plugins: [plugins.ReactTestComponent, plugins.ReactElement],
    highlight: true,
  });

export default format;
