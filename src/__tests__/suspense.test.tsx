import * as React from 'react';
import { Text, View } from 'react-native';

import { act, renderAsync, screen } from '..';

const testGateReact19 = React.version.startsWith('19.') ? test : test.skip;

function Suspending({ promise, testID }: { promise: Promise<unknown>; testID: string }) {
  React.use(promise);
  return <View testID={testID} />;
}

testGateReact19('resolves manually-controlled promise', async () => {
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

testGateReact19('resolves timer-controlled promise', async () => {
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

testGateReact19('handles promise rejection with error boundary', async () => {
  let rejectPromise: (error: Error) => void;
  const promise = new Promise<unknown>((_, reject) => {
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
  await act(async () => rejectPromise(new Error('Test error')));

  expect(screen.getByText('Error occurred')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('error-content')).not.toBeOnTheScreen();
});

testGateReact19('handles multiple suspending components', async () => {
  let resolvePromise1: (value: unknown) => void;
  let resolvePromise2: (value: unknown) => void;
  
  const promise1 = new Promise((resolve) => { resolvePromise1 = resolve; });
  const promise2 = new Promise((resolve) => { resolvePromise2 = resolve; });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise1} testID="content-1" />
        <Suspending promise={promise2} testID="content-2" />
      </React.Suspense>
    </View>
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


testGateReact19('handles multiple suspense boundaries independently', async () => {
  let resolvePromise1: (value: unknown) => void;
  let resolvePromise2: (value: unknown) => void;
  
  const promise1 = new Promise((resolve) => { resolvePromise1 = resolve; });
  const promise2 = new Promise((resolve) => { resolvePromise2 = resolve; });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>First Loading...</Text>}>
        <Suspending promise={promise1} testID="content-1" />
      </React.Suspense>
      <React.Suspense fallback={<Text>Second Loading...</Text>}>
        <Suspending promise={promise2} testID="content-2" />
      </React.Suspense>
    </View>
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
