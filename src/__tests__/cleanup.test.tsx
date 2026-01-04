import * as React from 'react';
import { View } from 'react-native';

import { cleanupAsync, deprecated_renderSync, render } from '../pure';

class Test extends React.Component<{ onUnmount: () => void }> {
  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }
  render() {
    return <View />;
  }
}

test('cleanup after deprecated_renderSync', async () => {
  const fn = jest.fn();

  deprecated_renderSync(<Test onUnmount={fn} />);
  deprecated_renderSync(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();

  await cleanupAsync();
  expect(fn).toHaveBeenCalledTimes(2);
});

test('cleanup after render', async () => {
  const fn = jest.fn();

  await render(<Test onUnmount={fn} />);
  await render(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();

  await cleanupAsync();
  expect(fn).toHaveBeenCalledTimes(2);
});
