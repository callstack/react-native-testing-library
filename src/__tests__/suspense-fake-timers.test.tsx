import * as React from 'react';
import { Text, View } from 'react-native';

import { act, renderAsync, screen } from '..';
import { excludeConsoleMessage } from '../test-utils/console';

jest.useFakeTimers();

// eslint-disable-next-line no-console
const originalConsoleError = console.error;
afterEach(() => {
  // eslint-disable-next-line no-console
  console.error = originalConsoleError;
});

function Suspending({ promise, testID }: { promise: Promise<unknown>; testID: string }) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore React 18 does not have `use` hook
  React.use(promise);
  return <View testID={testID} />;
}

test('resolves manually-controlled promise', async () => {
  let resolvePromise: (value: unknown) => void;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise} testID="content" />
        <View testID="sibling" />
      </React.Suspense>
    </View>,
  );
  expect(screen.getByText('Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('sibling')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolvePromise(null));
  expect(screen.getByTestId('content')).toBeOnTheScreen();
  expect(screen.getByTestId('sibling')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
});

test('resolves timer-controlled promise', async () => {
  const promise = new Promise((resolve) => {
    setTimeout(() => resolve(null), 100);
  });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise} testID="content" />
        <View testID="sibling" />
      </React.Suspense>
    </View>,
  );
  expect(screen.getByText('Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('sibling')).not.toBeOnTheScreen();

  expect(await screen.findByTestId('content')).toBeOnTheScreen();
  expect(screen.getByTestId('content')).toBeOnTheScreen();
  expect(screen.getByTestId('sibling')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

test('handles promise rejection with error boundary', async () => {
  const ERROR_MESSAGE = 'Promise Rejected In Test';
  // eslint-disable-next-line no-console
  console.error = excludeConsoleMessage(console.error, ERROR_MESSAGE);

  let rejectPromise: (error: Error) => void;
  const promise = new Promise<unknown>((_resolve, reject) => {
    rejectPromise = reject;
  });

  await renderAsync(
    <ErrorBoundary fallback={<Text>Error occurred</Text>}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise} testID="content" />
      </React.Suspense>
    </ErrorBoundary>,
  );

  expect(screen.getByText('Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => rejectPromise(new Error(ERROR_MESSAGE)));

  expect(screen.getByText('Error occurred')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('error-content')).not.toBeOnTheScreen();
});

test('handles multiple suspending components', async () => {
  let resolvePromise1: (value: unknown) => void;
  let resolvePromise2: (value: unknown) => void;

  const promise1 = new Promise((resolve) => {
    resolvePromise1 = resolve;
  });
  const promise2 = new Promise((resolve) => {
    resolvePromise2 = resolve;
  });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise1} testID="content-1" />
        <Suspending promise={promise2} testID="content-2" />
      </React.Suspense>
    </View>,
  );

  expect(screen.getByText('Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content-1')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('content-2')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolvePromise1(null));
  expect(screen.getByText('Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content-1')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('content-2')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolvePromise2(null));
  expect(screen.getByTestId('content-1')).toBeOnTheScreen();
  expect(screen.getByTestId('content-2')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
});

test('handles multiple suspense boundaries independently', async () => {
  let resolvePromise1: (value: unknown) => void;
  let resolvePromise2: (value: unknown) => void;

  const promise1 = new Promise((resolve) => {
    resolvePromise1 = resolve;
  });
  const promise2 = new Promise((resolve) => {
    resolvePromise2 = resolve;
  });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>First Loading...</Text>}>
        <Suspending promise={promise1} testID="content-1" />
      </React.Suspense>
      <React.Suspense fallback={<Text>Second Loading...</Text>}>
        <Suspending promise={promise2} testID="content-2" />
      </React.Suspense>
    </View>,
  );

  expect(screen.getByText('First Loading...')).toBeOnTheScreen();
  expect(screen.getByText('Second Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content-1')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('content-2')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolvePromise1(null));
  expect(screen.getByTestId('content-1')).toBeOnTheScreen();
  expect(screen.queryByText('First Loading...')).not.toBeOnTheScreen();
  expect(screen.getByText('Second Loading...')).toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolvePromise2(null));
  expect(screen.getByTestId('content-2')).toBeOnTheScreen();
  expect(screen.queryByText('Second Loading...')).not.toBeOnTheScreen();
});
