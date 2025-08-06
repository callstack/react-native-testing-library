import * as React from 'react';
import { Text, View } from 'react-native';

import { act, renderAsync, screen } from '..';

jest.useFakeTimers();

const testGateReact19 = React.version.startsWith('19.') ? test : test.skip;

function Suspending({ promise }: { promise: Promise<unknown> }) {
  React.use(promise);
  return <View testID="content" />;
}

testGateReact19('resolves manually-controlled promise', async () => {
  let resolvePromise: (value: unknown) => void;
  const promise = new Promise((resolve) => {
    resolvePromise = resolve;
  });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise} />
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
        <Suspending promise={promise} />
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

function DelayedSuspending({ delay, id }: { delay: number; id: string }) {
  let resolvePromise: (value: string) => void;
  const promise = React.useMemo(() => 
    new Promise<string>((resolve) => {
      resolvePromise = resolve;
      setTimeout(() => resolve(`data-${id}`), delay);
    }), [delay, id]
  );
  
  const data = React.use(promise);
  return <View testID={`delayed-content-${data}`} />;
}

testGateReact19('handles timer-based promises with fake timers', async () => {
  let resolveManual: (value: unknown) => void;
  const manualPromise = new Promise((resolve) => {
    resolveManual = resolve;
  });

  await renderAsync(
    <View>
      <React.Suspense fallback={<Text>Manual Loading...</Text>}>
        <Suspending promise={manualPromise} />
      </React.Suspense>
      <View testID="outside-suspense" />
    </View>,
  );

  expect(screen.getByText('Manual Loading...')).toBeOnTheScreen();
  expect(screen.getByTestId('outside-suspense')).toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolveManual(null));
  expect(screen.getByTestId('content')).toBeOnTheScreen();
  expect(screen.queryByText('Manual Loading...')).not.toBeOnTheScreen();
});

class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || <Text>Something went wrong.</Text>;
    }

    return this.props.children;
  }
}

testGateReact19('handles suspense with error boundary in fake timers', async () => {
  let rejectPromise: (error: Error) => void;
  const promise = new Promise<unknown>((_, reject) => {
    rejectPromise = reject;
  });

  await renderAsync(
    <ErrorBoundary fallback={<Text>Error occurred</Text>}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <Suspending promise={promise} />
      </React.Suspense>
    </ErrorBoundary>,
  );

  expect(screen.getByText('Loading...')).toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => rejectPromise(new Error('Test error')));

  expect(screen.getByText('Error occurred')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
});

function MultiComponentSuspense() {
  let resolveFirst: (value: unknown) => void;
  let resolveSecond: (value: unknown) => void;
  
  const firstPromise = new Promise((resolve) => {
    resolveFirst = resolve;
  });
  const secondPromise = new Promise((resolve) => {
    resolveSecond = resolve;
  });
  
  return (
    <View>
      <React.Suspense fallback={<Text>First Loading...</Text>}>
        <Suspending promise={firstPromise} />
      </React.Suspense>
      <React.Suspense fallback={<Text>Second Loading...</Text>}>
        <View testID="second-boundary">
          <Suspending promise={secondPromise} />
        </View>
      </React.Suspense>
    </View>
  );
}

testGateReact19('handles multiple independent suspense boundaries', async () => {
  await renderAsync(<MultiComponentSuspense />);
  
  expect(screen.getByText('First Loading...')).toBeOnTheScreen();
  expect(screen.getByText('Second Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('second-boundary')).not.toBeOnTheScreen();
});
