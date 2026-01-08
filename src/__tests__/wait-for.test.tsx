import * as React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { configure, fireEvent, render, screen, waitFor } from '..';

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

class BananaContainer extends React.Component<object, any> {
  state = { fresh: false };

  onChangeFresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.setState({ fresh: true });
  };

  render() {
    return <Banana onChangeFresh={this.onChangeFresh} fresh={this.state.fresh} />;
  }
}

afterEach(() => {
  jest.useRealTimers();
});

test('waits for element until it stops throwing', async () => {
  await render(<BananaContainer />);

  await fireEvent.press(screen.getByText('Change freshness!'));

  expect(screen.queryByText('Fresh')).toBeNull();

  const freshBananaText = await waitFor(() => screen.getByText('Fresh'));

  expect(freshBananaText.props.children).toBe('Fresh');
});

test('waits for element until timeout is met', async () => {
  await render(<BananaContainer />);

  await fireEvent.press(screen.getByText('Change freshness!'));

  await expect(waitFor(() => screen.getByText('Fresh'), { timeout: 100 })).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => screen.getByText('Fresh'));
});

test('waitFor defaults to asyncWaitTimeout config option', async () => {
  configure({ asyncUtilTimeout: 100 });
  await render(<BananaContainer />);

  await fireEvent.press(screen.getByText('Change freshness!'));
  await expect(waitFor(() => screen.getByText('Fresh'))).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => screen.getByText('Fresh'), { timeout: 1000 });
});

test('waitFor timeout option takes precendence over `asyncWaitTimeout` config option', async () => {
  configure({ asyncUtilTimeout: 2000 });
  await render(<BananaContainer />);

  await fireEvent.press(screen.getByText('Change freshness!'));
  await expect(waitFor(() => screen.getByText('Fresh'), { timeout: 100 })).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => screen.getByText('Fresh'));
});

test('waits for element with custom interval', async () => {
  const mockFn = jest.fn(() => {
    throw Error('test');
  });

  try {
    await waitFor(() => mockFn(), { timeout: 400, interval: 200 });
  } catch {
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
  await render(<Comp onPress={spy} />);

  await fireEvent.press(screen.getByText('Trigger'));

  await waitFor(() => {
    expect(spy).toHaveBeenCalled();
  });
});

test.each([false, true])(
  'waits for element until it stops throwing using fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });
    await render(<BananaContainer />);

    await fireEvent.press(screen.getByText('Change freshness!'));
    expect(screen.queryByText('Fresh')).toBeNull();

    jest.advanceTimersByTime(300);
    const freshBananaText = await waitFor(() => screen.getByText('Fresh'));

    expect(freshBananaText.props.children).toBe('Fresh');
  },
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
    } catch {
      // suppress
    }

    expect(mockFn).toHaveBeenCalledTimes(3);
  },
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
    } catch {
      // suppress
    }

    expect(mockErrorFn).toHaveBeenCalledTimes(3);
    expect(mockHandleFn).toHaveBeenCalledTimes(1);
  },
);

const blockThread = (timeToBlockThread: number, legacyFakeTimers: boolean) => {
  jest.useRealTimers();
  const end = Date.now() + timeToBlockThread;

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
        }),
    ).rejects.toThrow();

    // Verify that the `waitFor` callback has been called the expected number of times
    // (timeout / interval + 1), so it confirms that the real duration of callback did not
    // cause the real clock timeout when running using fake timers.
    expect(mockErrorFn).toHaveBeenCalledTimes(WAIT_FOR_TIMEOUT / WAIT_FOR_INTERVAL + 1);
  },
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
    } catch {
      // suppress
    }

    expect(mockFn).toHaveBeenCalledTimes(3);
  },
);

test.each([
  [false, false],
  [true, false],
  [true, true],
])(
  'flushes scheduled updates before returning (fakeTimers = %s, legacyFakeTimers = %s)',
  async (fakeTimers, legacyFakeTimers) => {
    if (fakeTimers) {
      jest.useFakeTimers({ legacyFakeTimers });
    }

    function Apple({ onPress }: { onPress: (color: string) => void }) {
      const [color, setColor] = React.useState('green');
      const [syncedColor, setSyncedColor] = React.useState(color);

      // On mount, set the color to "red" in a promise microtask
      React.useEffect(() => {
        // eslint-disable-next-line @typescript-eslint/no-floating-promises, promise/catch-or-return, promise/prefer-await-to-then
        Promise.resolve('red').then((c) => setColor(c));
      }, []);

      // Sync the `color` state to `syncedColor` state, but with a delay caused by the effect
      React.useEffect(() => {
        setSyncedColor(color);
      }, [color]);

      return (
        <View testID="root">
          <Text>{color}</Text>
          <Pressable onPress={() => onPress(syncedColor)}>
            <Text>Trigger</Text>
          </Pressable>
        </View>
      );
    }

    const onPress = jest.fn();
    await render(<Apple onPress={onPress} />);

    // Required: this `waitFor` will succeed on first check, because the "root" view is there
    // since the initial mount.
    await waitFor(() => screen.getByTestId('root'));

    // This `waitFor` will also succeed on first check, because the promise that sets the
    // `color` state to "red" resolves right after the previous `await waitFor` statement.
    await waitFor(() => screen.getByText('red'));

    // Check that the `onPress` callback is called with the already-updated value of `syncedColor`.
    await fireEvent.press(screen.getByText('Trigger'));
    expect(onPress).toHaveBeenCalledWith('red');
  },
);

test('waitFor throws if expectation is not a function', async () => {
  await expect(
    // @ts-expect-error intentionally passing non-function
    waitFor('not a function'),
  ).rejects.toThrowErrorMatchingInlineSnapshot(`"Received \`expectation\` arg must be a function"`);
});

test.each([false, true])(
  'waitFor throws clear error when switching from fake timers to real timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });

    const waitForPromise = waitFor(() => {
      // Switch to real timers during waitFor - this should trigger an error
      jest.useRealTimers();
      throw new Error('test');
    });

    await expect(waitForPromise).rejects.toThrow(
      'Changed from using fake timers to real timers while using waitFor',
    );
  },
);

test('waitFor throws clear error when switching from real timers to fake timers', async () => {
  jest.useRealTimers();

    const waitForPromise = waitFor(() => {
      // Switch to fake timers during waitFor - this should trigger an error
      jest.useFakeTimers();
      throw new Error('test');
    });

    await expect(waitForPromise).rejects.toThrow(
      'Changed from using real timers to fake timers while using waitFor',
    );
});
