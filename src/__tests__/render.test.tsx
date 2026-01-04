import * as React from 'react';
import { Text, View } from 'react-native';

import { render, screen } from '..';

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

test('render renders component asynchronously', async () => {
  await render(<View testID="test" />);
  expect(screen.getByTestId('test')).toBeOnTheScreen();
});

test('render with wrapper option', async () => {
  const WrapperComponent = ({ children }: { children: React.ReactNode }) => (
    <View testID="wrapper">{children}</View>
  );

  await render(<View testID="inner" />, {
    wrapper: WrapperComponent,
  });

  expect(screen.getByTestId('wrapper')).toBeTruthy();
  expect(screen.getByTestId('inner')).toBeTruthy();
});

test('rerender function throws error when used with render', async () => {
  await render(<Banana />);

  expect(() => screen.rerender(<Banana />)).toThrowErrorMatchingInlineSnapshot(
    `""rerender(...)" is not supported when using "render" use "await rerenderAsync(...)" instead"`,
  );
});

test('rerenderAsync function updates component asynchronously', async () => {
  const fn = jest.fn();
  await render(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(0);

  await screen.rerenderAsync(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(1);
});

test('unmount function throws error when used with render', async () => {
  await render(<Banana />);

  expect(() => screen.unmount()).toThrowErrorMatchingInlineSnapshot(
    `""unmount()" is not supported when using "render" use "await unmountAsync()" instead"`,
  );
});

test('unmountAsync function unmounts component asynchronously', async () => {
  const fn = jest.fn();
  await render(<Banana onUnmount={fn} />);

  await screen.unmountAsync();
  expect(fn).toHaveBeenCalled();
});
