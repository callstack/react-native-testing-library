// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { View } from 'react-native';
import { cleanup, render } from '..';

class Test extends React.Component<*> {
  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }
  render() {
    return <View />;
  }
}

test('cleanup', () => {
  const fn = jest.fn();

  render(<Test onUnmount={fn} />);
  render(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();

  cleanup();
  expect(fn).toHaveBeenCalledTimes(2);
});
