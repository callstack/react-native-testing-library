import * as React from 'react';
import { View } from 'react-native';

let render: (element: React.ReactElement) => void;
beforeAll(() => {
  process.env.RNTL_SKIP_AUTO_CLEANUP = 'true';
  const rntl = require('..');
  render = rntl.render;
});

let isMounted = false;

class Test extends React.Component<{ onUnmount?(): void }> {
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

// This just verifies that by importing RNTL in pure mode in an environment which supports
// afterEach (like jest) we won't get automatic cleanup between tests.
test('component is mounted, but not umounted before test ends', () => {
  const fn = jest.fn();
  render(<Test onUnmount={fn} />);
  expect(fn).not.toHaveBeenCalled();
});

test('component is NOT automatically umounted after first test ends', () => {
  expect(isMounted).toEqual(true);
});
