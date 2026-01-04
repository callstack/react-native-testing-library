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

test('rerender function updates component asynchronously', async () => {
  const fn = jest.fn();
  await render(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(0);

  await screen.rerender(<Banana onUpdate={fn} />);
  expect(fn).toHaveBeenCalledTimes(1);
});

test('unmount function unmounts component asynchronously', async () => {
  const fn = jest.fn();
  await render(<Banana onUnmount={fn} />);

  await screen.unmount();
  expect(fn).toHaveBeenCalled();
});
