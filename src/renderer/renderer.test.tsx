import * as React from 'react';
import { View, Text } from 'react-native';
import { render } from './renderer';

test('renders View', () => {
  render(<View />);
  expect(true).toBe(true);
});

test('renders Text', () => {
  render(<Text>Hello world</Text>);
  expect(true).toBe(true);
});

test('throws when rendering string inside View', () => {
  expect(() => render(<View>Hello</View>)).toThrowErrorMatchingInlineSnapshot(
    `"Text string "Hello" must be rendered inside <Text> component"`,
  );
});

test('implements toJSON()', () => {
  const result = render(
    <View testID="view">
      <Text style={{ color: 'blue' }}>Hello</Text>
    </View>,
  );
  expect(result.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    >
      <Text
        style={
          {
            "color": "blue",
          }
        }
      >
        Hello
      </Text>
    </View>
  `);
});
