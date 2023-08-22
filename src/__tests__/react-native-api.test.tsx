import * as React from 'react';
import {
  View,
  Text,
  TextInput,
  Switch,
  ScrollView,
  FlatList,
} from 'react-native';
import { render } from '..';

/**
 * Tests in this file are intended to give us an proactive warning that React Native behavior has
 * changed in a way that may impact our code like queries or event handling.
 */

test('React Native API assumption: <View> renders single host element', () => {
  const view = render(<View testID="test" />);

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <View
      testID="test"
    />
  `);
});

test('React Native API assumption: <Text> renders single host element', () => {
  const view = render(<Text testID="test">Hello</Text>);

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Text
      testID="test"
    >
      Hello
    </Text>
  `);
});

test('React Native API assumption: nested <Text> renders single host element', () => {
  const view = render(
    <Text testID="test">
      <Text testID="before">Before</Text>
      Hello
      <Text testID="after">
        <Text testID="deeplyNested">Deeply nested</Text>
      </Text>
    </Text>
  );

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <Text
      testID="test"
    >
      <Text
        testID="before"
      >
        Before
      </Text>
      Hello
      <Text
        testID="after"
      >
        <Text
          testID="deeplyNested"
        >
          Deeply nested
        </Text>
      </Text>
    </Text>
  `);
});

test('React Native API assumption: <TextInput> renders single host element', () => {
  const view = render(
    <TextInput
      testID="test"
      defaultValue="default"
      value="currentValue"
      placeholder="Placeholder"
    />
  );

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <TextInput
      defaultValue="default"
      placeholder="Placeholder"
      testID="test"
      value="currentValue"
    />
  `);
});

test('React Native API assumption: <TextInput> with nested Text renders single host element', () => {
  const view = render(
    <TextInput testID="test" placeholder="Placeholder">
      <Text>Hello</Text>
    </TextInput>
  );

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <TextInput
      placeholder="Placeholder"
      testID="test"
    >
      <Text>
        Hello
      </Text>
    </TextInput>
  `);
});

test('React Native API assumption: <Switch> renders single host element', () => {
  const view = render(
    <Switch testID="test" value={true} onChange={jest.fn()} />
  );

  expect(view.toJSON()).toMatchInlineSnapshot(`
    <RCTSwitch
      accessibilityRole="switch"
      onChange={[Function]}
      onResponderTerminationRequest={[Function]}
      onStartShouldSetResponder={[Function]}
      style={
        {
          "height": 31,
          "width": 51,
        }
      }
      testID="test"
      value={true}
    />
  `);
});

test('ScrollView renders correctly', () => {
  const screen = render(
    <ScrollView testID="scrollView">
      <View testID="view" />
    </ScrollView>
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RCTScrollView
      testID="scrollView"
    >
      <View>
        <View
          testID="view"
        />
      </View>
    </RCTScrollView>
  `);
});

test('FlatList renders correctly', () => {
  const screen = render(
    <FlatList
      testID="flatList"
      data={[1, 2]}
      renderItem={({ item }) => <Text>{item}</Text>}
    />
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RCTScrollView
      data={
        [
          1,
          2,
        ]
      }
      getItem={[Function]}
      getItemCount={[Function]}
      keyExtractor={[Function]}
      onContentSizeChange={[Function]}
      onLayout={[Function]}
      onMomentumScrollBegin={[Function]}
      onMomentumScrollEnd={[Function]}
      onScroll={[Function]}
      onScrollBeginDrag={[Function]}
      onScrollEndDrag={[Function]}
      removeClippedSubviews={false}
      renderItem={[Function]}
      scrollEventThrottle={50}
      stickyHeaderIndices={[]}
      testID="flatList"
      viewabilityConfigCallbackPairs={[]}
    >
      <View>
        <View
          onFocusCapture={[Function]}
          onLayout={[Function]}
          style={null}
        >
          <Text>
            1
          </Text>
        </View>
        <View
          onFocusCapture={[Function]}
          onLayout={[Function]}
          style={null}
        >
          <Text>
            2
          </Text>
        </View>
      </View>
    </RCTScrollView>
  `);
});
