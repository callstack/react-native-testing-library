import * as React from 'react';
import { Text, View } from 'react-native';

import { act, renderAsync, screen } from '..';

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
  expect(screen.getByTestId('sibling')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
});

function SuspendingWithError({ promise }: { promise: Promise<unknown> }) {
  React.use(promise);
  return <View testID="error-content" />;
}

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

testGateReact19('handles promise rejection with error boundary', async () => {
  let rejectPromise: (error: Error) => void;
  const promise = new Promise<unknown>((_, reject) => {
    rejectPromise = reject;
  });

  await renderAsync(
    <ErrorBoundary fallback={<Text>Error occurred</Text>}>
      <React.Suspense fallback={<Text>Loading...</Text>}>
        <SuspendingWithError promise={promise} />
      </React.Suspense>
    </ErrorBoundary>,
  );

  expect(screen.getByText('Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('error-content')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => rejectPromise(new Error('Test error')));

  expect(screen.getByText('Error occurred')).toBeOnTheScreen();
  expect(screen.queryByText('Loading...')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('error-content')).not.toBeOnTheScreen();
});

function NestedSuspending({ promise }: { promise: Promise<unknown> }) {
  React.use(promise);
  return (
    <React.Suspense fallback={<Text>Inner Loading...</Text>}>
      <View testID="inner-resolved" />
    </React.Suspense>
  );
}

testGateReact19('handles nested suspense boundaries', async () => {
  let resolveOuterPromise: (value: unknown) => void;
  const outerPromise = new Promise((resolve) => {
    resolveOuterPromise = resolve;
  });

  await renderAsync(
    <React.Suspense fallback={<Text>Outer Loading...</Text>}>
      <NestedSuspending promise={outerPromise} />
    </React.Suspense>,
  );

  expect(screen.getByText('Outer Loading...')).toBeOnTheScreen();
  expect(screen.queryByText('Inner Loading...')).not.toBeOnTheScreen();

  // eslint-disable-next-line require-await
  await act(async () => resolveOuterPromise(null));

  expect(screen.getByTestId('inner-resolved')).toBeOnTheScreen();
  expect(screen.queryByText('Outer Loading...')).not.toBeOnTheScreen();
  expect(screen.queryByText('Inner Loading...')).not.toBeOnTheScreen();
});

function FirstSuspending({ promise }: { promise: Promise<unknown> }) {
  React.use(promise);
  return <View testID="first-resolved" />;
}

function SecondSuspending({ promise }: { promise: Promise<unknown> }) {
  React.use(promise);
  return <View testID="second-resolved" />;
}

testGateReact19('handles multiple suspending promises in same boundary', async () => {
  let resolvePromise1: (value: unknown) => void;
  let resolvePromise2: (value: unknown) => void;
  
  const promise1 = new Promise((resolve) => {
    resolvePromise1 = resolve;
  });
  const promise2 = new Promise((resolve) => {
    resolvePromise2 = resolve;
  });

  await renderAsync(
    <React.Suspense fallback={<Text>Multiple Loading...</Text>}>
      <FirstSuspending promise={promise1} />
      <SecondSuspending promise={promise2} />
    </React.Suspense>,
  );

  expect(screen.getByText('Multiple Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('first-resolved')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('second-resolved')).not.toBeOnTheScreen();

  // Resolve first promise - should still be loading because second is pending
  // eslint-disable-next-line require-await
  await act(async () => resolvePromise1(null));
  expect(screen.getByText('Multiple Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('first-resolved')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('second-resolved')).not.toBeOnTheScreen();

  // Resolve second promise - should now render all content
  // eslint-disable-next-line require-await
  await act(async () => resolvePromise2(null));
  expect(screen.getByTestId('first-resolved')).toBeOnTheScreen();
  expect(screen.getByTestId('second-resolved')).toBeOnTheScreen();
  expect(screen.queryByText('Multiple Loading...')).not.toBeOnTheScreen();
});

function ConditionalSuspending({ shouldSuspend, promiseResolver }: { shouldSuspend: boolean; promiseResolver?: () => void }) {
  if (shouldSuspend) {
    const promise = React.useMemo(() => new Promise<void>((resolve) => {
      if (promiseResolver) {
        promiseResolver = resolve;
      }
    }), [promiseResolver]);
    React.use(promise);
  }
  return <View testID="conditional-content" />;
}

testGateReact19('handles conditional suspense', async () => {
  const result = await renderAsync(
    <React.Suspense fallback={<Text>Conditional Loading...</Text>}>
      <ConditionalSuspending shouldSuspend={false} />
    </React.Suspense>,
  );

  // Should render immediately when not suspending
  expect(screen.getByTestId('conditional-content')).toBeOnTheScreen();
  expect(screen.queryByText('Conditional Loading...')).not.toBeOnTheScreen();

  // Re-render with suspense - this creates a new component that will suspend
  await result.rerenderAsync(
    <React.Suspense fallback={<Text>Conditional Loading...</Text>}>
      <ConditionalSuspending shouldSuspend={true} />
    </React.Suspense>,
  );

  // Should now be suspended
  expect(screen.getByText('Conditional Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('conditional-content')).not.toBeOnTheScreen();
});

function SuspendingWithState() {
  const [isReady, setIsReady] = React.useState(false);
  
  React.useEffect(() => {
    const timer = setTimeout(() => setIsReady(true), 100);
    return () => clearTimeout(timer);
  }, []);

  if (!isReady) {
    const promise = new Promise(() => {}); // Never resolves
    React.use(promise);
  }
  
  return <View testID="state-ready-content" />;
}

testGateReact19('handles suspense with state updates', async () => {
  await renderAsync(
    <React.Suspense fallback={<Text>State Loading...</Text>}>
      <SuspendingWithState />
    </React.Suspense>,
  );

  expect(screen.getByText('State Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('state-ready-content')).not.toBeOnTheScreen();

  // Wait for state update to resolve suspense
  expect(await screen.findByTestId('state-ready-content')).toBeOnTheScreen();
  expect(screen.queryByText('State Loading...')).not.toBeOnTheScreen();
});
