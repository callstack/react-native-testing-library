import * as React from 'react';
import { View } from 'react-native';

import { fireEvent, render, screen } from '../..';

// React keeps two copies of each fiber and switches between them on every commit. When React
// skips the host element, `unstable_fiber` and `return` pointers can lead to the copy from an
// earlier commit, whose props hold the `onPress` of an earlier render (#1961).

type TriggerProps = { onPress: () => void };

function MemoizedHostTrigger(_props: TriggerProps) {
  return React.useMemo(() => <View testID="trigger" />, []);
}

const MemoizedInner = React.memo(function MemoizedInner() {
  return <View testID="trigger" />;
});

function MemoizedChildTrigger(_props: TriggerProps) {
  return <MemoizedInner />;
}

function renderPressCounter(Trigger: React.ComponentType<TriggerProps>) {
  const calledFromRenders: number[] = [];
  let renderCount = 0;

  function App() {
    const [, rerender] = React.useReducer((n: number) => n + 1, 0);
    const renderId = ++renderCount;
    return (
      <Trigger
        onPress={() => {
          calledFromRenders.push(renderId);
          rerender();
        }}
      />
    );
  }

  return { calledFromRenders, renderApp: () => render(<App />) };
}

test.each([
  ['returns the same host element', MemoizedHostTrigger],
  ['renders a memoized child', MemoizedChildTrigger],
])(
  'fireEvent calls the handler from the latest render when the composite %s',
  async (_, Trigger) => {
    const { calledFromRenders, renderApp } = renderPressCounter(Trigger);
    await renderApp();

    for (let i = 0; i < 4; i++) {
      await fireEvent.press(screen.getByTestId('trigger'));
    }

    // Each press re-renders the app, so the next press gets the handler of the next render.
    expect(calledFromRenders).toEqual([1, 2, 3, 4]);
  },
);
