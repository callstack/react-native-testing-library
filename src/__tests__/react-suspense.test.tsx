import * as React from 'react';
import { View } from 'react-native';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';

import { configure, renderAsync, screen, within } from '..';

configure({
  asyncUtilTimeout: 5000,
});

function wait(delay: number) {
  return new Promise<void>((resolve) =>
    setTimeout(() => {
      resolve();
    }, delay),
  );
}

function Suspendable<T>({ promise }: { promise: Promise<T> }) {
  React.use(promise);
  return <View testID="test" />;
}

test('render supports components which can suspend', async () => {
  await renderAsync(
    <View>
      <React.Suspense fallback={<View testID="fallback" />}>
        <Suspendable promise={wait(100)} />
      </React.Suspense>
    </View>,
  );

  expect(screen.getByTestId('fallback')).toBeOnTheScreen();
  expect(await screen.findByTestId('test')).toBeOnTheScreen();
});

test('react test renderer supports components which can suspend', async () => {
  let renderer: ReactTestRenderer;

  // eslint-disable-next-line require-await
  await React.act(async () => {
    renderer = TestRenderer.create(
      <View>
        <React.Suspense fallback={<View testID="fallback" />}>
          <Suspendable promise={wait(100)} />
        </React.Suspense>
      </View>,
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const view = within(renderer!.root);

  expect(view.getByTestId('fallback')).toBeDefined();
  expect(await view.findByTestId('test')).toBeDefined();
});

test('react test renderer supports components which can suspend 500', async () => {
  let renderer: ReactTestRenderer;

  // eslint-disable-next-line require-await
  await React.act(async () => {
    renderer = TestRenderer.create(
      <View>
        <React.Suspense fallback={<View testID="fallback" />}>
          <Suspendable promise={wait(500)} />
        </React.Suspense>
      </View>,
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const view = within(renderer!.root);

  expect(view.getByTestId('fallback')).toBeDefined();
  expect(await view.findByTestId('test')).toBeDefined();
});

test('react test renderer supports components which can suspend 1000ms', async () => {
  let renderer: ReactTestRenderer;

  // eslint-disable-next-line require-await
  await React.act(async () => {
    renderer = TestRenderer.create(
      <View>
        <React.Suspense fallback={<View testID="fallback" />}>
          <Suspendable promise={wait(1000)} />
        </React.Suspense>
      </View>,
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const view = within(renderer!.root);

  expect(view.getByTestId('fallback')).toBeDefined();
  expect(await view.findByTestId('test', undefined, { timeout: 5000 })).toBeDefined();
});
