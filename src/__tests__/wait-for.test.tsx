import * as React from 'react';
import { Pressable, Text, TouchableOpacity, View } from 'react-native';

import { configure, fireEvent, render, screen, waitFor } from '..';
import { useTimerType } from '../test-utils/timers';

beforeEach(() => {
  jest.useRealTimers();
});

test('waits for expect() assertion to pass', async () => {
  const mockFunction = jest.fn();

  function AsyncComponent() {
    React.useEffect(() => {
      setTimeout(() => mockFunction(), 100);
    }, []);

    return <View />;
  }

  await render(<AsyncComponent />);
  await waitFor(() => expect(mockFunction).toHaveBeenCalled());
  expect(mockFunction).toHaveBeenCalledTimes(1);
});

test.each([
  { timerType: 'real' as const },
  { timerType: 'fake' as const },
  { timerType: 'fake-legacy' as const },
])('waits for query with $timerType timers', async ({ timerType }) => {
  function AsyncComponent() {
    const [text, setText] = React.useState('Loading...');

    React.useEffect(() => {
      setTimeout(() => setText('Loaded'), 100);
    }, []);

    return <Text>{text}</Text>;
  }

  useTimerType(timerType);
  await render(<AsyncComponent />);
  await waitFor(() => screen.getByText('Loaded'));
  expect(screen.getByText('Loaded')).toBeOnTheScreen();
});

test('throws timeout error when condition never becomes true', async () => {
  function Component() {
    return <Text>Hello</Text>;
  }

  await render(<Component />);
  await expect(waitFor(() => screen.getByText('Never appears'), { timeout: 100 })).rejects.toThrow(
    'Unable to find an element with text: Never appears',
  );
});

test('uses custom error from onTimeout callback when timeout occurs', async () => {
  const customErrorMessage = 'Custom timeout error: Element never appeared';

  await render(<View />);
  await expect(
    waitFor(() => screen.getByText('Never appears'), {
      timeout: 100,
      onTimeout: () => new Error(customErrorMessage),
    }),
  ).rejects.toThrow(customErrorMessage);
});

test('throws TypeError when expectation is not a function', async () => {
  await expect(waitFor(null as any)).rejects.toThrow(
    'Received `expectation` arg must be a function',
  );
});

test('throws error when switching from real timers to fake timers during waitFor', async () => {
  await render(<View />);

  const waitForPromise = waitFor(() => {
    // This will never pass, but we'll switch timers before timeout
    return screen.getByText('Never appears');
  });

  // Switch to fake timers while waitFor is running
  jest.useFakeTimers();

  await expect(waitForPromise).rejects.toThrow(
    'Changed from using real timers to fake timers while using waitFor',
  );
});

test('throws error when switching from fake timers to real timers during waitFor', async () => {
  jest.useFakeTimers();
  await render(<View />);

  const waitForPromise = waitFor(() => {
    // This will never pass, but we'll switch timers before timeout
    return screen.getByText('Never appears');
  });

  // Switch to real timers while waitFor is running
  jest.useRealTimers();

  await expect(waitForPromise).rejects.toThrow(
    'Changed from using fake timers to real timers while using waitFor',
  );
});

test('converts non-Error thrown value to Error when timeout occurs', async () => {
  const errorMessage = 'Custom string error';

  let caughtError: unknown;
  try {
    await waitFor(
      () => {
        throw errorMessage;
      },
      { timeout: 50 },
    );
  } catch (error) {
    caughtError = error;
  }

  expect(caughtError).toBeInstanceOf(Error);
  expect((caughtError as Error).message).toBe(errorMessage);
});

test('continues waiting when expectation returns a promise that rejects', async () => {
  let attemptCount = 0;
  const maxAttempts = 3;

  await waitFor(
    () => {
      attemptCount++;
      if (attemptCount < maxAttempts) {
        return Promise.reject(new Error('Not ready yet'));
      }
      return Promise.resolve('Success');
    },
    { timeout: 1000 },
  );

  expect(attemptCount).toBe(maxAttempts);
});

test('throws timeout error with fake timers when condition never becomes true', async () => {
  jest.useFakeTimers();
  await render(<View />);

  const waitForPromise = waitFor(() => screen.getByText('Never appears'), { timeout: 100 });

  await jest.advanceTimersByTimeAsync(100);

  await expect(waitForPromise).rejects.toThrow('Unable to find an element with text: Never appears');
});

test('throws generic timeout error when promise rejects with falsy value until timeout', async () => {
  await expect(
    waitFor(() => Promise.reject(null), {
      timeout: 100,
    }),
  ).rejects.toThrow('Timed out in waitFor.');
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

test('waitFor defaults to asyncUtilTimeout config option', async () => {
  class BananaContainer extends React.Component<object, any> {
    state = { fresh: false };

    onChangeFresh = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.setState({ fresh: true });
    };

    render() {
      return (
        <View>
          {this.state.fresh && <Text>Fresh</Text>}
          <TouchableOpacity onPress={this.onChangeFresh}>
            <Text>Change freshness!</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  configure({ asyncUtilTimeout: 100 });
  await render(<BananaContainer />);

  fireEvent.press(screen.getByText('Change freshness!'));

  expect(screen.queryByText('Fresh')).toBeNull();

  await expect(waitFor(() => screen.getByText('Fresh'))).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => screen.getByText('Fresh'), { timeout: 1000 });
});

test('waitFor timeout option takes precedence over asyncUtilTimeout config option', async () => {
  class BananaContainer extends React.Component<object, any> {
    state = { fresh: false };

    onChangeFresh = async () => {
      await new Promise((resolve) => setTimeout(resolve, 300));
      this.setState({ fresh: true });
    };

    render() {
      return (
        <View>
          {this.state.fresh && <Text>Fresh</Text>}
          <TouchableOpacity onPress={this.onChangeFresh}>
            <Text>Change freshness!</Text>
          </TouchableOpacity>
        </View>
      );
    }
  }

  configure({ asyncUtilTimeout: 2000 });
  await render(<BananaContainer />);

  fireEvent.press(screen.getByText('Change freshness!'));

  expect(screen.queryByText('Fresh')).toBeNull();

  await expect(waitFor(() => screen.getByText('Fresh'), { timeout: 100 })).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => screen.getByText('Fresh'));
});

test('waits for async event with fireEvent', async () => {
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

  const spy = jest.fn();
  await render(<Comp onPress={spy} />);

  await fireEvent.press(screen.getByText('Trigger'));

  await waitFor(() => {
    expect(spy).toHaveBeenCalled();
  });
});

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

test.each([true, false])(
  'it should not depend on real time when using fake timers (legacyFakeTimers = %s)',
  async (legacyFakeTimers) => {
    jest.useFakeTimers({ legacyFakeTimers });
    const WAIT_FOR_INTERVAL = 20;
    const WAIT_FOR_TIMEOUT = WAIT_FOR_INTERVAL * 5;

    const blockThread = (timeToBlockThread: number, legacyFakeTimers: boolean) => {
      jest.useRealTimers();
      const end = Date.now() + timeToBlockThread;

      while (Date.now() < end) {
        // do nothing
      }

      jest.useFakeTimers({ legacyFakeTimers });
    };

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
  'waits for assertion until timeout is met with fake timers and interval (legacyFakeTimers = %s)',
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
  'waits for assertion until timeout is met with fake timers, interval, and onTimeout (legacyFakeTimers = %s)',
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
