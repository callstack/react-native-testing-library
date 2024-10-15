import * as React from 'react';
import { View, Text } from 'react-native';
import { render } from './renderer';

function Passthrough({ children }: { children: React.ReactNode }) {
  return children;
}

test('renders View', () => {
  render(<View />);
  expect(true).toBe(true);
});

test('renders Text', () => {
  render(<Text>Hello world</Text>);
  expect(true).toBe(true);
});

test('throws when rendering string outside of Text', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => render(<View>Hello</View>)).toThrowErrorMatchingInlineSnapshot(
    `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <View> component."`,
  );

  expect(() => render(<Passthrough>Hello</Passthrough>)).toThrowErrorMatchingInlineSnapshot(
    `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <ROOT> component."`,
  );

  expect(() => render(<>Hello</>)).toThrowErrorMatchingInlineSnapshot(
    `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <ROOT> component."`,
  );

  jest.restoreAllMocks();
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
    <View
      testID="view"
    />
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
