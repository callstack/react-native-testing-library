import React from 'react';
import { View } from 'react-native';

let render;
beforeAll(() => {
  process.env.RNTL_SKIP_AUTO_CLEANUP = 'true';
  const rtl = require('../');
  render = rtl.render;
});

let isMounted = false;

class Test extends React.Component<*> {
  componentDidMount() {
    isMounted = true;
  }

  componentWillUnmount() {
    isMounted = false;
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }
  render() {
    return <View />;
  }
}

// This just verifies that by importing RNTL in an
// environment which supports afterEach (like jest)
// we'll get automatic cleanup between tests.
test('first', () => {
  const fn = jest.fn();
  render(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();
});

test('second', () => {
  expect(isMounted).toEqual(true);
});
