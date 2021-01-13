// @flow
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Button } from 'react-native';
import { render } from '..';

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';

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
        />
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

const MyComponent = () => {
  return <Text>My Component</Text>;
};

test('getByTestId returns only native elements', () => {
  const { getByTestId, getAllByTestId } = render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
      <MyComponent testID="myComponent" />
    </View>
  );

  expect(getByTestId('text')).toBeTruthy();
  expect(getByTestId('textInput')).toBeTruthy();
  expect(getByTestId('view')).toBeTruthy();
  expect(getByTestId('button')).toBeTruthy();

  expect(getAllByTestId('text')).toHaveLength(1);
  expect(getAllByTestId('textInput')).toHaveLength(1);
  expect(getAllByTestId('view')).toHaveLength(1);
  expect(getAllByTestId('button')).toHaveLength(1);

  expect(() => getByTestId('myComponent')).toThrowError(
    'Unable to find an element with testID: myComponent'
  );
  expect(() => getAllByTestId('myComponent')).toThrowError(
    'Unable to find an element with testID: myComponent'
  );
});

test('supports a regex matcher', () => {
  const { getByTestId, getAllByTestId } = render(
    <View>
      <Text testID="text">Text</Text>
      <TextInput testID="textInput" />
      <View testID="view" />
      <Button testID="button" title="Button" onPress={jest.fn()} />
      <MyComponent testID="myComponent" />
    </View>
  );

  expect(getByTestId(/view/)).toBeTruthy();
  expect(getAllByTestId(/text/)).toHaveLength(2);
});

test('getByTestId, queryByTestId', () => {
  const { getByTestId, queryByTestId } = render(<Banana />);
  const component = getByTestId('bananaFresh');

  expect(component.props.children).toBe('not fresh');
  expect(() => getByTestId('InExistent')).toThrow(
    'Unable to find an element with testID: InExistent'
  );

  expect(getByTestId('bananaFresh')).toBe(component);
  expect(queryByTestId('InExistent')).toBeNull();
});

test('getAllByTestId, queryAllByTestId', () => {
  const { getAllByTestId, queryAllByTestId } = render(<Banana />);
  const textElements = getAllByTestId('duplicateText');

  expect(textElements.length).toBe(2);
  expect(textElements[0].props.children).toBe('First Text');
  expect(textElements[1].props.children).toBe('Second Text');
  expect(() => getAllByTestId('nonExistentTestId')).toThrow(
    'Unable to find an element with testID: nonExistentTestId'
  );

  const queriedTextElements = queryAllByTestId('duplicateText');

  expect(queriedTextElements.length).toBe(2);
  expect(queriedTextElements[0]).toBe(textElements[0]);
  expect(queriedTextElements[1]).toBe(textElements[1]);
  expect(queryAllByTestId('nonExistentTestId')).toHaveLength(0);
});

test('findByTestId and findAllByTestId work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const { rerender, findByTestId, findAllByTestId } = render(<View />);
  await expect(findByTestId('aTestId', options)).rejects.toBeTruthy();
  await expect(findAllByTestId('aTestId', options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      rerender(
        <View testID="aTestId">
          <Text>Some Text</Text>
          <TextInput placeholder="Placeholder Text" />
          <TextInput value="Display Value" />
        </View>
      ),
    20
  );

  await expect(findByTestId('aTestId')).resolves.toBeTruthy();
  await expect(findAllByTestId('aTestId')).resolves.toHaveLength(1);
}, 20000);
