import * as React from 'react';
import { View } from 'react-native';

import { cleanupAsync, render } from '../pure';

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

test('cleanup', async () => {
  const fn = jest.fn();

  render(<Test onUnmount={fn} />);
  render(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();

  await cleanupAsync();
  expect(fn).toHaveBeenCalledTimes(2);
});
