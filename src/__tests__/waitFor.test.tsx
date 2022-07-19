import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fireEvent, render, waitFor } from '..';

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

  expect(mockFn).toHaveBeenCalledTimes(2);
});

test.each([false, true])(
  'waits for element until it stops throwing using fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });
    const { getByText, queryByText } = render(<BananaContainer />);

    fireEvent.press(getByText('Change freshness!'));
    expect(queryByText('Fresh')).toBeNull();

    jest.advanceTimersByTime(300);
    const freshBananaText = await waitFor(() => getByText('Fresh'));

    expect(freshBananaText.props.children).toBe('Fresh');
  }
);

test.each([false, true])(
  'waits for assertion until timeout is met with fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });

    const mockFn = jest.fn(() => {
      throw Error('test');
    });

    try {
      await waitFor(() => mockFn(), { timeout: 400, interval: 200 });
    } catch (error) {
      // suppress
    }

    expect(mockFn).toHaveBeenCalledTimes(3);
  }
);

test.each([false, true])(
  'waits for assertion until timeout is met with fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });

    const mockErrorFn = jest.fn(() => {
      throw Error('test');
    });

    const mockHandleFn = jest.fn((e) => e);

    try {
      await waitFor(() => mockErrorFn(), {
        timeout: 400,
        interval: 200,
        onTimeout: mockHandleFn,
      });
    } catch (error) {
      // suppress
    }

    expect(mockErrorFn).toHaveBeenCalledTimes(3);
    expect(mockHandleFn).toHaveBeenCalledTimes(1);
  }
);

test.each([false, true])(
  'awaiting something that succeeds before timeout works with fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });

    let calls = 0;
    const mockFn = jest.fn(() => {
      calls += 1;
      if (calls < 3) {
        throw Error('test');
      }
    });

    try {
      await waitFor(() => mockFn(), { timeout: 400, interval: 200 });
    } catch (error) {
      // suppress
    }

    expect(mockFn).toHaveBeenCalledTimes(3);
  }
);
