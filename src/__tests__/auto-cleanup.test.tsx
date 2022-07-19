import * as React from 'react';
import { View } from 'react-native';
import { render } from '..';

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

afterEach(() => {
  jest.useRealTimers();
});

// This just verifies that by importing RNTL in an environment which supports afterEach (like jest)
// we'll get automatic cleanup between tests.
test('component is mounted, but not umounted before test ends', () => {
  const fn = jest.fn();
  render(<Test onUnmount={fn} />);
  expect(isMounted).toEqual(true);
  expect(fn).not.toHaveBeenCalled();
});

test('component is automatically umounted after first test ends', () => {
  expect(isMounted).toEqual(false);
});

test('does not time out with legacy fake timers', () => {
  jest.useFakeTimers({ legacyFakeTimers: true });
  render(<Test />);
  expect(isMounted).toEqual(true);
});

test('does not time out with fake timers', () => {
  jest.useFakeTimers();
  render(<Test />);
  expect(isMounted).toEqual(true);
});
