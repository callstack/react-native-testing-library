// @flow
import * as React from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { render } from '..';

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';
const DEFAULT_INPUT_CHEF = 'What did you inspect?';
const DEFAULT_INPUT_CUSTOMER = 'What banana?';

class MyButton extends React.Component<any> {
  render() {
    return (
      <TouchableOpacity onPress={this.props.onPress}>
        <Text>{this.props.children}</Text>
      </TouchableOpacity>
    );
  }
}

class Banana extends React.Component<any, any> {
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
    const test = 0;
    return (
      <View>
        <Text>Is the banana fresh?</Text>
        <Text testID="bananaFresh">
          {this.state.fresh ? 'fresh' : 'not fresh'}
        </Text>
        <TextInput
          testID="bananaCustomFreshness"
          placeholder={PLACEHOLDER_FRESHNESS}
          value={INPUT_FRESHNESS}
        />
        <TextInput
          testID="bananaChef"
          placeholder={PLACEHOLDER_CHEF}
          value={INPUT_CHEF}
          defaultValue={DEFAULT_INPUT_CHEF}
        />
        <TextInput defaultValue={DEFAULT_INPUT_CUSTOMER} />
        <TextInput defaultValue={'hello'} value="" />
        <MyButton onPress={this.changeFresh} type="primary">
          Change freshness!
        </MyButton>
        <Text testID="duplicateText">First Text</Text>
        <Text testID="duplicateText">Second Text</Text>
        <Text>{test}</Text>
      </View>
    );
  }
}

test('getByPlaceholderText, queryByPlaceholderText', () => {
  const { getByPlaceholderText, queryByPlaceholderText } = render(<Banana />);
  const input = getByPlaceholderText(/custom/i);

  expect(input.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);

  const sameInput = getByPlaceholderText(PLACEHOLDER_FRESHNESS);

  expect(sameInput.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);
  expect(() => getByPlaceholderText('no placeholder')).toThrow(
    'Unable to find an element with placeholder: no placeholder'
  );

  expect(queryByPlaceholderText(/add/i)).toBe(input);
  expect(queryByPlaceholderText('no placeholder')).toBeNull();
  expect(() => queryByPlaceholderText(/fresh/)).toThrow(
    'Found multiple elements with placeholder: /fresh/ '
  );
});

test('getAllByPlaceholderText, queryAllByPlaceholderText', () => {
  const { getAllByPlaceholderText, queryAllByPlaceholderText } = render(
    <Banana />
  );
  const inputs = getAllByPlaceholderText(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => getAllByPlaceholderText('no placeholder')).toThrow(
    'Unable to find an element with placeholder: no placeholder'
  );

  expect(queryAllByPlaceholderText(/fresh/i)).toEqual(inputs);
  expect(queryAllByPlaceholderText('no placeholder')).toHaveLength(0);
});
