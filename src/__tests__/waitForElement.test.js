// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent, waitForElement } from '..';

class Banana extends React.Component<*, *> {
  changeFresh = () => {
    this.props.onChangeFresh();
  };

  render() {
    return (
      <View>
        {this.props.fresh && <Text testID="fresh">Fresh</Text>}
        <TouchableOpacity testID="changeFreshness" onPress={this.changeFresh}>
          <Text>Change freshness!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

class BananaContainer extends React.Component<*, *> {
  state = { fresh: false };

  onChangeFresh = async () => {
    await new Promise(resolve => setTimeout(resolve, 300));
    this.setState({ fresh: true });
  };

  render() {
    return (
      <Banana onChangeFresh={this.onChangeFresh} fresh={this.state.fresh} />
    );
  }
}

test('waits for element until it stops throwing', async () => {
  const { getByTestId, queryByTestId } = render(<BananaContainer />);

  fireEvent.press(getByTestId('changeFreshness'));

  expect(queryByTestId('fresh')).toBeNull();

  const freshBananaText = await waitForElement(() => getByTestId('fresh'));

  expect(freshBananaText.props.children).toBe('Fresh');
});

test('waits for element until timeout is met', async () => {
  const { getByTestId } = render(<BananaContainer />);

  fireEvent.press(getByTestId('changeFreshness'));

  await expect(
    waitForElement(() => getByTestId('fresh'), 100)
  ).rejects.toThrow();
});

test('waits for element with custom interval', async () => {
  const mockFn = jest.fn(() => {
    throw Error('test');
  });

  try {
    await waitForElement(() => mockFn(), 400, 200);
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
    waitForElement(() => mockFn(), 400, 200);
  } catch (e) {
    // suppress
  }
  jest.runTimersToTime(400);

  expect(mockFn).toHaveBeenCalledTimes(3);

  jest.useRealTimers();
});
