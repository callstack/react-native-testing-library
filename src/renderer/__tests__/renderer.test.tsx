import * as React from 'react';
import { View, Text } from 'react-native';
import { createRenderer } from '../renderer';

function Passthrough({ children }: { children: React.ReactNode }) {
  return children;
}

function RendersNull() {
  return null;
}

test('renders View', () => {
  const renderer = createRenderer();
  renderer.render(<View />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`<View />`);
});

test('renders Text', () => {
  const renderer = createRenderer();
  renderer.render(<Text>Hello RNTL!</Text>);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    <Text>
      Hello RNTL!
    </Text>
  `);
});

test('can update rendered element', () => {
  const renderer = createRenderer();
  renderer.render(<View testID="view" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    />
  `);

  renderer.render(
    <View testID="view">
      <Text>Hello</Text>
    </View>,
  );
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    >
      <Text>
        Hello
      </Text>
    </View>
  `);
});

test('can unmount renderer element', () => {
  const renderer = createRenderer();
  renderer.render(<View testID="view" />);
  expect(renderer.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="view"
    />
  `);

  renderer.unmount();
  expect(renderer.toJSON()).toBeNull();
});

test('returns root view', () => {
  const renderer = createRenderer();
  renderer.render(<View testID="view" />);
  expect(renderer.root).toMatchInlineSnapshot(`
    <View
      testID="view"
    />
  `);
});

test('returns container view', () => {
  const renderer = createRenderer();
  renderer.render(<View testID="view" />);
  expect(renderer.container).toMatchInlineSnapshot(`
    <CONTAINER>
      <View
        testID="view"
      />
    </CONTAINER>
  `);
});

test('returns null when rendering indirectly null', () => {
  const renderer = createRenderer();
  renderer.render(<RendersNull />);

  expect(renderer.container).toMatchInlineSnapshot(`<CONTAINER />`);
  expect(renderer.root).toBeNull();
  expect(renderer.toJSON()).toBeNull();
});

test('throws when rendering string outside of Text', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  expect(() => createRenderer().render(<View>Hello</View>)).toThrowErrorMatchingInlineSnapshot(
    `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <View> component."`,
  );

  expect(() =>
    createRenderer().render(<Passthrough>Hello</Passthrough>),
  ).toThrowErrorMatchingInlineSnapshot(
    `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <ROOT> component."`,
  );

  expect(() => createRenderer().render(<>Hello</>)).toThrowErrorMatchingInlineSnapshot(
    `"Invariant Violation: Text strings must be rendered within a <Text> component. Detected attempt to render "Hello" string within a <ROOT> component."`,
  );

  jest.restoreAllMocks();
});
