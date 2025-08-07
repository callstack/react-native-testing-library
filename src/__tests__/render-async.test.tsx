import * as React from 'react';
import { Text, View } from 'react-native';

import { renderAsync, screen } from '..';

class Banana extends React.Component<any, { fresh: boolean }> {
  state = {
    fresh: false,
  };

  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }

  componentWillUnmount() {
    if (this.props.onUnmount) {
      this.props.onUnmount();
    }
  }

  changeFresh = () => {
    this.setState((state) => ({
      fresh: !state.fresh,
    }));
  };

  render() {
    return (
      <View>
        <Text>Is the banana fresh?</Text>
        <Text testID="bananaFresh">{this.state.fresh ? 'fresh' : 'not fresh'}</Text>
      </View>
    );
  }
}

test('renderAsync renders component asynchronously', async () => {
  await renderAsync(<View testID="test" />);
  expect(screen.getByTestId('test')).toBeOnTheScreen();
});

test('renderAsync with wrapper option', async () => {
  const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
    <View testID="wrapper">{children}</View>
  );

  await renderAsync(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(screen.getByTestId('wrapper')).toBeTruthy();
  expect(screen.getByTestId('inner')).toBeTruthy();
});

test('renderAsync supports concurrent rendering option', async () => {
  await renderAsync(<View testID="test" />, { concurrentRoot: true });
  expect(screen.root).toBeOnTheScreen();
});

test('renderAsync supports legacy rendering option', async () => {
  await renderAsync(<View testID="test" />, { concurrentRoot: false });
  expect(screen.root).toBeOnTheScreen();
});

test('rerender function throws error when used with renderAsync', async () => {
  await renderAsync(<Banana />);

  expect(() => screen.rerender(<Banana />)).toThrowErrorMatchingInlineSnapshot(
    `""rerender(...)" is not supported when using "renderAsync" use "await rerenderAsync(...)" instead"`,
  );
});

test('rerenderAsync function updates component asynchronously', async () => {
  const fn = jest.fn();
  await renderAsync(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(0);

  await screen.rerenderAsync(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(1);
});

test('unmount function throws error when used with renderAsync', async () => {
  await renderAsync(<Banana />);

  expect(() => screen.unmount()).toThrowErrorMatchingInlineSnapshot(
    `""unmount()" is not supported when using "renderAsync" use "await unmountAsync()" instead"`,
  );
});

test('unmountAsync function unmounts component asynchronously', async () => {
  const fn = jest.fn();
  await renderAsync(<Banana onUnmount={fn} />);

  await screen.unmountAsync();
  expect(fn).toHaveBeenCalled();
});

test('container property displays deprecation message', async () => {
  await renderAsync(<View testID="inner" />);

  expect(() => (screen as any).container).toThrowErrorMatchingInlineSnapshot(`
    "'container' property has been renamed to 'UNSAFE_root'.

    Consider using 'root' property which returns root host element."
  `);
});

test('debug function handles null JSON', async () => {
  const result = await renderAsync(<View testID="test" />);

  // Mock toJSON to return null to test the debug edge case
  const originalToJSON = result.toJSON;
  (result as any).toJSON = jest.fn().mockReturnValue(null);

  // This should not throw and handle null JSON gracefully
  expect(() => result.debug()).not.toThrow();

  // Restore original toJSON
  (result as any).toJSON = originalToJSON;
});
