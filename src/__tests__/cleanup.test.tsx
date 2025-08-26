import * as React from 'react';
import { View } from 'react-native';

import { cleanupAsync, render, renderAsync } from '../pure';

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

test('cleanup after render', async () => {
  const fn = jest.fn();

  render(<Test onUnmount={fn} />);
  render(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();

  await cleanupAsync();
  expect(fn).toHaveBeenCalledTimes(2);
});

test('cleanup after renderAsync', async () => {
  const fn = jest.fn();

  await renderAsync(<Test onUnmount={fn} />);
  await renderAsync(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();

  await cleanupAsync();
  expect(fn).toHaveBeenCalledTimes(2);
});
