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

testGateReact19('handles multiple suspense boundaries independently', async () => {
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
        <Suspending promise={promise1} />
      </React.Suspense>
      <React.Suspense fallback={<Text>Second Loading...</Text>}>
        <View testID="second-boundary">
          <Suspending promise={promise2} />
        </View>
      </React.Suspense>
    </View>
  );

  expect(screen.getByText('First Loading...')).toBeOnTheScreen();
  expect(screen.getByText('Second Loading...')).toBeOnTheScreen();
  expect(screen.queryByTestId('content')).not.toBeOnTheScreen();
  expect(screen.queryByTestId('second-boundary')).not.toBeOnTheScreen();

  // Resolve first promise
  // eslint-disable-next-line require-await
  await act(async () => resolvePromise1(null));
  expect(screen.getByTestId('content')).toBeOnTheScreen();
  expect(screen.queryByText('First Loading...')).not.toBeOnTheScreen();
  expect(screen.getByText('Second Loading...')).toBeOnTheScreen();

  // Resolve second promise
  // eslint-disable-next-line require-await
  await act(async () => resolvePromise2(null));
  expect(screen.getByTestId('second-boundary')).toBeOnTheScreen();
  expect(screen.queryByText('Second Loading...')).not.toBeOnTheScreen();
});
