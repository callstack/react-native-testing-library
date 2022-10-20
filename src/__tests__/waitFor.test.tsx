import * as React from 'react';
import { Text, TouchableOpacity, View, Pressable } from 'react-native';
import { fireEvent, render, waitFor, configure, resetToDefaults } from '..';

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

beforeEach(() => {
  resetToDefaults();
});

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

test('waitFor defaults to asyncWaitTimeout config option', async () => {
  configure({ asyncUtilTimeout: 100 });
  const { getByText } = render(<BananaContainer />);

  fireEvent.press(getByText('Change freshness!'));
  await expect(waitFor(() => getByText('Fresh'))).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => getByText('Fresh'), { timeout: 1000 });
});

test('waitFor timeout option takes precendence over `asyncWaitTimeout` config option', async () => {
  configure({ asyncUtilTimeout: 2000 });
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

// this component is convoluted on purpose. It is not a good react pattern, but it is valid
// react code that will run differently between different react versions (17 and 18), so we need
// explicit tests for it
const Comp = ({ onPress }: { onPress: () => void }) => {
  const [state, setState] = React.useState(false);

  React.useEffect(() => {
    if (state) {
      onPress();
    }
  }, [state, onPress]);

  return (
    <Pressable
      onPress={async () => {
        await Promise.resolve();
        setState(true);
      }}
    >
      <Text>Trigger</Text>
    </Pressable>
  );
};

test('waits for async event with fireEvent', async () => {
  const spy = jest.fn();
  const { getByText } = render(<Comp onPress={spy} />);

  fireEvent.press(getByText('Trigger'));

  await waitFor(() => {
    expect(spy).toHaveBeenCalled();
  });
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

const blockThread = (timeToBlockThread: number, legacyFakeTimers: boolean) => {
  jest.useRealTimers();
  let end = Date.now() + timeToBlockThread;

  while (Date.now() < end) {
    // do nothing
  }

  jest.useFakeTimers({ legacyFakeTimers });
};

test.each([true, false])(
  'it should not depend on real time when using fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });
    const WAIT_FOR_INTERVAL = 20;
    const WAIT_FOR_TIMEOUT = WAIT_FOR_INTERVAL * 5;

    const mockErrorFn = jest.fn(() => {
      // Wait 2 times interval so that check time is longer than interval
      blockThread(WAIT_FOR_INTERVAL * 2, legacyFakeTimers);
      throw new Error('test');
    });

    await expect(
      async () =>
        await waitFor(mockErrorFn, {
          timeout: WAIT_FOR_TIMEOUT,
          interval: WAIT_FOR_INTERVAL,
        })
    ).rejects.toThrow();

    // Verify that the `waitFor` callback has been called the expected number of times
    // (timeout / interval + 1), so it confirms that the real duration of callback did not
    // cause the real clock timeout when running using fake timers.
    expect(mockErrorFn).toHaveBeenCalledTimes(
      WAIT_FOR_TIMEOUT / WAIT_FOR_INTERVAL + 1
    );
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
