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

function AnimationSuspending() {
  const [progress, setProgress] = React.useState(0);
  
  React.useEffect(() => {
    const animate = () => {
      setProgress(p => {
        if (p >= 100) return 100;
        setTimeout(animate, 16); // 60fps
        return p + 1;
      });
    };
    animate();
  }, []);

  if (progress < 100) {
    const promise = new Promise(() => {}); // Suspend until animation complete
    React.use(promise);
  }
  
  return <View testID="animation-complete" />;
}

testGateReact19('handles animation-like suspense with fake timers', async () => {
  await renderAsync(
    <React.Suspense fallback={<Text>Animating...</Text>}>
      <AnimationSuspending />
    </React.Suspense>,
  );

  expect(screen.getByText('Animating...')).toBeOnTheScreen();
  expect(screen.queryByTestId('animation-complete')).not.toBeOnTheScreen();

  // Should complete after animation finishes
  expect(await screen.findByTestId('animation-complete')).toBeOnTheScreen();
  expect(screen.queryByText('Animating...')).not.toBeOnTheScreen();
});

function RetryingSuspending({ maxRetries = 3 }: { maxRetries?: number }) {
  const [retries, setRetries] = React.useState(0);
  
  const promise = React.useMemo(() => {
    if (retries < maxRetries) {
      // Simulate a failing request that retries
      setTimeout(() => setRetries(r => r + 1), 100);
      return new Promise(() => {}); // Never resolves, will retry
    }
    // Success case
    return Promise.resolve('success');
  }, [retries, maxRetries]);
  
  const data = React.use(promise);
  return <View testID={`retry-content-${data}`} />;
}

testGateReact19('handles retry logic with fake timers', async () => {
  await renderAsync(
    <React.Suspense fallback={<Text>Retrying...</Text>}>
      <RetryingSuspending maxRetries={2} />
    </React.Suspense>,
  );

  expect(screen.getByText('Retrying...')).toBeOnTheScreen();
  expect(screen.queryByTestId('retry-content-success')).not.toBeOnTheScreen();

  // Should eventually succeed after retries
  expect(await screen.findByTestId('retry-content-success')).toBeOnTheScreen();
  expect(screen.queryByText('Retrying...')).not.toBeOnTheScreen();
});

function CascadingSuspending({ level }: { level: number }) {
  const delay = level * 50;
  const promise = React.useMemo(() => 
    new Promise((resolve) => {
      setTimeout(() => resolve(level), delay);
    }), [delay, level]
  );
  
  const data = React.use(promise);
  
  if (level > 1) {
    return (
      <View>
        <View testID={`cascade-${data}`} />
        <React.Suspense fallback={<Text>Cascade Loading {level - 1}...</Text>}>
          <CascadingSuspending level={level - 1} />
        </React.Suspense>
      </View>
    );
  }
  
  return <View testID={`cascade-${data}`} />;
}

testGateReact19('handles cascading suspense with fake timers', async () => {
  await renderAsync(
    <React.Suspense fallback={<Text>Cascade Loading 3...</Text>}>
      <CascadingSuspending level={3} />
    </React.Suspense>,
  );

  expect(screen.getByText('Cascade Loading 3...')).toBeOnTheScreen();

  // Should resolve level by level
  expect(await screen.findByTestId('cascade-3')).toBeOnTheScreen();
  expect(screen.getByText('Cascade Loading 2...')).toBeOnTheScreen();
  
  expect(await screen.findByTestId('cascade-2')).toBeOnTheScreen();
  expect(screen.getByText('Cascade Loading 1...')).toBeOnTheScreen();
  
  expect(await screen.findByTestId('cascade-1')).toBeOnTheScreen();
  expect(screen.queryByText('Cascade Loading 1...')).not.toBeOnTheScreen();
  expect(screen.queryByText('Cascade Loading 2...')).not.toBeOnTheScreen();
  expect(screen.queryByText('Cascade Loading 3...')).not.toBeOnTheScreen();
});
