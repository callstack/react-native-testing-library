// @flow
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitFor } from '..';

class Banana extends React.Component<any> {
  changeFresh = () => {
    this.props.onChangeFresh();
  };

  render() {
    return (
      <View>
        {this.props.fresh && <Text>Fresh</Text>}
        <TouchableOpacity onPress={this.changeFresh}>
          <Text>Change freshness!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class BananaContainer extends React.Component<{}, any> {
  state = { fresh: false };

  onChangeFresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.setState({ fresh: true });
  };

  render() {
    return (
      <Banana onChangeFresh={this.onChangeFresh} fresh={this.state.fresh} />
    );
  }
}

afterEach(() => {
  jest.useRealTimers();
});

test('waits for element until it stops throwing', async () => {
  const { getByText, queryByText } = render(<BananaContainer />);

  fireEvent.press(getByText('Change freshness!'));

  expect(queryByText('Fresh')).toBeNull();

  const freshBananaText = await waitFor(() => getByText('Fresh'));

  expect(freshBananaText.props.children).toBe('Fresh');
});

test('waits for element until timeout is met', async () => {
  const { getByText } = render(<BananaContainer />);

  fireEvent.press(getByText('Change freshness!'));

  await expect(
    waitFor(() => getByText('Fresh'), { timeout: 100 })
  ).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => getByText('Fresh'));
});

test('waits for element with custom interval', async () => {
  const mockFn = jest.fn(() => {
    throw Error('test');
  });

  try {
    await waitFor(() => mockFn(), { timeout: 400, interval: 200 });
  } catch (e) {
    // suppress
  }

  expect(mockFn).toHaveBeenCalledTimes(3);
});

test('works with fake timers', async () => {
  jest.useFakeTimers();

  const mockFn = jest.fn(() => {
    throw Error('test');
  });

  try {
    waitFor(() => mockFn(), { timeout: 400, interval: 200 });
  } catch (e) {
    // suppress
  }
  jest.advanceTimersByTime(400);

  expect(mockFn).toHaveBeenCalledTimes(3);
});

test('works with modern fake timers', async () => {
  jest.useFakeTimers('modern');

  const mockFn = jest.fn(() => {
    throw Error('test');
  });

  try {
    waitFor(() => mockFn(), { timeout: 400, interval: 200 });
  } catch (e) {
    // suppress
  }
  jest.advanceTimersByTime(400);

  expect(mockFn).toHaveBeenCalledTimes(3);
});
