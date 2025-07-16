/* eslint-disable jest/no-standalone-expect */
import * as React from 'react';
import { View } from 'react-native';
import TestRenderer, { type ReactTestRenderer } from 'react-test-renderer';

import { configure, renderAsync, screen, within } from '..';

const isReact19 = React.version.startsWith('19.');
const testGateReact19 = isReact19 ? test : test.skip;

jest.useFakeTimers();

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

function Suspending<T>({ promise }: { promise: Promise<T> }) {
  React.use(promise);
  return <View testID="view" />;
}

testGateReact19('renderAsync supports components which can suspend', async () => {
  await renderAsync(
    <View>
      <React.Suspense fallback={<View testID="fallback" />}>
        <Suspending promise={wait(100)} />
      </React.Suspense>
    </View>,
  );

  expect(screen.getByTestId('fallback')).toBeOnTheScreen();
  expect(await screen.findByTestId('view')).toBeOnTheScreen();
});

testGateReact19('react test renderer supports components which can suspend', async () => {
  let renderer: ReactTestRenderer;

  // eslint-disable-next-line require-await
  await React.act(async () => {
    renderer = TestRenderer.create(
      <View>
        <React.Suspense fallback={<View testID="fallback" />}>
          <Suspending promise={wait(100)} />
        </React.Suspense>
      </View>,
    );
  });

  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const view = within(renderer!.root);

  expect(view.getByTestId('fallback')).toBeDefined();
  expect(await view.findByTestId('view')).toBeDefined();
});
