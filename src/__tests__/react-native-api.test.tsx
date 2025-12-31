import * as React from 'react';
import { FlatList, Image, Modal, ScrollView, Switch, Text, TextInput, View } from 'react-native';

import { render, screen } from '..';

/**
 * Tests in this file are intended to give us an proactive warning that React Native behavior has
 * changed in a way that may impact our code like queries or event handling.
 */

test('React Native API assumption: <View> renders a single host element', () => {
  render(<View testID="test" />);

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <View
        testID="test"
      />
    </RntlContainer>
  `);
});

test('React Native API assumption: <Text> renders a single host element', () => {
  render(<Text testID="test">Hello</Text>);

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <Text
        testID="test"
      >
        Hello
      </Text>
    </RntlContainer>
  `);
});

test('React Native API assumption: nested <Text> renders a single host element', () => {
  render(
    <Text testID="test">
      <Text testID="before">Before</Text>
      Hello
      <Text testID="after">
        <Text testID="deeplyNested">Deeply nested</Text>
      </Text>
    </Text>,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
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
    </RntlContainer>
  `);
});

test('React Native API assumption: <TextInput> renders a single host element', () => {
  render(
    <TextInput
      testID="test"
      defaultValue="default"
      value="currentValue"
      placeholder="Placeholder"
    />,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <TextInput
        defaultValue="default"
        placeholder="Placeholder"
        testID="test"
        value="currentValue"
      />
    </RntlContainer>
  `);
});

test('React Native API assumption: <TextInput> with nested Text renders single host element', () => {
  render(
    <TextInput testID="test" placeholder="Placeholder">
      <Text>Hello</Text>
    </TextInput>,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <TextInput
        placeholder="Placeholder"
        testID="test"
      >
        <Text>
          Hello
        </Text>
      </TextInput>
    </RntlContainer>
  `);
});

test('React Native API assumption: <Switch> renders a single host element', () => {
  render(<Switch testID="test" value={true} onChange={jest.fn()} />);

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
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
    </RntlContainer>
  `);
});

test('React Native API assumption: <Image> renders a single host element', () => {
  render(<Image testID="test" source={{ uri: 'https://fake.url/image.jpg' }} alt="Alt text" />);

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <Image
        alt="Alt text"
        source={
          {
            "uri": "https://fake.url/image.jpg",
          }
        }
        testID="test"
      />
    </RntlContainer>
  `);
});

test('React Native API assumption: <ScrollView> renders a single host element', () => {
  render(
    <ScrollView testID="scrollView">
      <View testID="view" />
    </ScrollView>,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <RCTScrollView
        testID="scrollView"
      >
        <View>
          <View
            testID="view"
          />
        </View>
      </RCTScrollView>
    </RntlContainer>
  `);
});

test('React Native API assumption: <FlatList> renders a single host <ScrollView> element', () => {
  render(
    <FlatList testID="flatList" data={[1, 2]} renderItem={({ item }) => <Text>{item}</Text>} />,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
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
        scrollEventThrottle={0.0001}
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
    </RntlContainer>
  `);
});

test('React Native API assumption: <Modal> renders a single host element', () => {
  render(
    <Modal testID="test">
      <Text>Modal Content</Text>
    </Modal>,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <Modal
        hardwareAccelerated={false}
        testID="test"
        visible={true}
      >
        <Text>
          Modal Content
        </Text>
      </Modal>
    </RntlContainer>
  `);
});

test('React Native API assumption: aria-* props render directly on host View', () => {
  render(
    <View
      testID="test"
      aria-busy
      aria-checked
      aria-disabled
      aria-expanded
      aria-hidden
      aria-label="Label"
      aria-labelledby="LabelledBy"
      aria-live="polite"
      aria-modal
      aria-pressed
      aria-readonly
      aria-required
      aria-selected
      aria-valuemax={10}
      aria-valuemin={0}
      aria-valuenow={5}
      aria-valuetext="ValueText"
    />,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <View
        aria-busy={true}
        aria-checked={true}
        aria-disabled={true}
        aria-expanded={true}
        aria-hidden={true}
        aria-label="Label"
        aria-labelledby="LabelledBy"
        aria-live="polite"
        aria-modal={true}
        aria-pressed={true}
        aria-readonly={true}
        aria-required={true}
        aria-selected={true}
        aria-valuemax={10}
        aria-valuemin={0}
        aria-valuenow={5}
        aria-valuetext="ValueText"
        testID="test"
      />
    </RntlContainer>
  `);
});

test('React Native API assumption: aria-* props render directly on host Text', () => {
  render(
    <Text
      testID="test"
      aria-busy
      aria-checked
      aria-disabled
      aria-expanded
      aria-hidden
      aria-label="Label"
      aria-labelledby="LabelledBy"
      aria-live="polite"
      aria-modal
      aria-pressed
      aria-readonly
      aria-required
      aria-selected
      aria-valuemax={10}
      aria-valuemin={0}
      aria-valuenow={5}
      aria-valuetext="ValueText"
    />,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <Text
        aria-busy={true}
        aria-checked={true}
        aria-disabled={true}
        aria-expanded={true}
        aria-hidden={true}
        aria-label="Label"
        aria-labelledby="LabelledBy"
        aria-live="polite"
        aria-modal={true}
        aria-pressed={true}
        aria-readonly={true}
        aria-required={true}
        aria-selected={true}
        aria-valuemax={10}
        aria-valuemin={0}
        aria-valuenow={5}
        aria-valuetext="ValueText"
        testID="test"
      />
    </RntlContainer>
  `);
});

test('React Native API assumption: aria-* props render directly on host TextInput', () => {
  render(
    <TextInput
      testID="test"
      aria-busy
      aria-checked
      aria-disabled
      aria-expanded
      aria-hidden
      aria-label="Label"
      aria-labelledby="LabelledBy"
      aria-live="polite"
      aria-modal
      aria-pressed
      aria-readonly
      aria-required
      aria-selected
      aria-valuemax={10}
      aria-valuemin={0}
      aria-valuenow={5}
      aria-valuetext="ValueText"
    />,
  );

  expect(screen.toJSON()).toMatchInlineSnapshot(`
    <RntlContainer>
      <TextInput
        aria-busy={true}
        aria-checked={true}
        aria-disabled={true}
        aria-expanded={true}
        aria-hidden={true}
        aria-label="Label"
        aria-labelledby="LabelledBy"
        aria-live="polite"
        aria-modal={true}
        aria-pressed={true}
        aria-readonly={true}
        aria-required={true}
        aria-selected={true}
        aria-valuemax={10}
        aria-valuemin={0}
        aria-valuenow={5}
        aria-valuetext="ValueText"
        testID="test"
      />
    </RntlContainer>
  `);
});
