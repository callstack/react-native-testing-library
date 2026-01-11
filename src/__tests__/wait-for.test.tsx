import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen, waitFor } from '..';
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
