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

test('implements update()', () => {
  const result = render(<View testID="view" />);
  expect(result.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    />
  `);

  result.update(
    <View testID="view">
      <Text>Hello</Text>
    </View>,
  );
  expect(result.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    >
      <Text>
        Hello
      </Text>
    </View>
  `);
});

test('implements unmount()', () => {
  const result = render(<View testID="view" />);
  expect(result.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    />
  `);

  result.unmount();
  expect(result.toJSON()).toBeNull();
});

test('implements get root()', () => {
  const result = render(<View testID="view" />);
  expect(result.root).toMatchInlineSnapshot(`
    HostElement {
      "children": [
        HostElement {
          "children": [],
          "props": {
            "children": undefined,
            "testID": "view",
          },
          "type": "View",
        },
      ],
      "props": {},
      "type": "ROOT",
    }
  `);
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
