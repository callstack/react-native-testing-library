// @flow
/* eslint-disable react/no-multi-comp */
import React from 'react';
import { View, Text, TouchableOpacity } from '../__mocks__/reactNativeMock';
import { render, fireEvent, waitForElement } from '..';

class Banana extends React.Component<*, *> {
  changeFresh = () => {
    this.props.onChangeFresh();
  };

  render() {
    return (
      <View>
        {this.props.fresh && <Text testID="fresh">Fresh</Text>}
        <TouchableOpacity onPress={this.changeFresh} type="primary">
          Change freshness!
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
  const { getByTestId, getByName, queryByTestId } = render(<BananaContainer />);

  fireEvent.press(getByName('TouchableOpacity'));

  expect(queryByTestId('fresh')).toBeNull();

  const freshBananaText = await waitForElement(() => getByTestId('fresh'));

  expect(freshBananaText.props.children).toBe('Fresh');
});

test('waits for element until timeout is met', async () => {
  const { getByTestId, getByName } = render(<BananaContainer />);

  fireEvent.press(getByName('TouchableOpacity'));

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

  expect(mockFn).toBeCalledTimes(3);
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

  expect(mockFn).toBeCalledTimes(3);

  jest.useRealTimers();
});
