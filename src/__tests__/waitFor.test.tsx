import * as React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { fireEvent, render, waitFor, configure, resetToDefaults } from '..';

class Banana extends React.Component<any> {
  changeFresh = () => {
    this.props.onChangeFresh();
  };

  render() {
    return (
      <View>
        {this.props.fresh && <Text>Fresh</Text>}
        <TouchableOpacity onPress={this.changeFresh}>
          <Text>Change freshness!</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

beforeEach(() => {
  resetToDefaults();
});

class BananaContainer extends React.Component<{}, any> {
  state = { fresh: false };

  onChangeFresh = async () => {
    await new Promise((resolve) => setTimeout(resolve, 300));
    this.setState({ fresh: true });
  };

  render() {
    return (
      <Banana onChangeFresh={this.onChangeFresh} fresh={this.state.fresh} />
    );
  }
}

afterEach(() => {
  jest.useRealTimers();
});

test('waits for element until timeout is met', async () => {
  const { getByText } = render(<BananaContainer />);

  fireEvent.press(getByText('Change freshness!'));

  await expect(
    waitFor(() => getByText('Fresh'), { timeout: 100 })
  ).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => getByText('Fresh'));
});

test('waitFor defaults to asyncWaitTimeout config option', async () => {
  configure({ asyncUtilTimeout: 100 });
  const { getByText } = render(<BananaContainer />);

  fireEvent.press(getByText('Change freshness!'));
  await expect(waitFor(() => getByText('Fresh'))).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => getByText('Fresh'), { timeout: 1000 });
});

test('waitFor timeout option takes precendence over `asyncWaitTimeout` config option', async () => {
  configure({ asyncUtilTimeout: 2000 });
  const { getByText } = render(<BananaContainer />);

  fireEvent.press(getByText('Change freshness!'));
  await expect(
    waitFor(() => getByText('Fresh'), { timeout: 100 })
  ).rejects.toThrow();

  // Async action ends after 300ms and we only waited 100ms, so we need to wait
  // for the remaining async actions to finish
  await waitFor(() => getByText('Fresh'));
});
