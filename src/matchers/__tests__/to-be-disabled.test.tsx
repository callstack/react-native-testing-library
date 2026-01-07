import React from 'react';
import {
  Button,
  Pressable,
  Text,
  TextInput,
  TouchableHighlight,
  TouchableNativeFeedback,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';

import { render, screen } from '../..';

test('toBeDisabled()/toBeEnabled() supports basic case', async () => {
  await render(
    <View>
      <View testID="disabled-parent" aria-disabled>
        <View>
          <View testID="disabled-child" />
        </View>
      </View>
      <View>
        <View testID="enabled-view" />
        <Text testID="enabled-text">Text</Text>
        <TextInput testID="enabled-text-input" />
        <Pressable testID="enabled-pressable" />
      </View>
    </View>,
  );

  expect(screen.getByTestId('disabled-parent')).toBeDisabled();
  expect(screen.getByTestId('disabled-child')).toBeDisabled();
  expect(screen.getByTestId('enabled-view')).not.toBeDisabled();
  expect(screen.getByTestId('enabled-text')).not.toBeDisabled();
  expect(screen.getByTestId('enabled-text-input')).not.toBeDisabled();
  expect(screen.getByTestId('enabled-pressable')).not.toBeDisabled();

  expect(() => expect(screen.getByTestId('disabled-parent')).not.toBeDisabled())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeDisabled()

    Received element is disabled:
      <View
        aria-disabled={true}
        testID="disabled-parent"
      />"
  `);

  expect(() => expect(screen.getByTestId('enabled-view')).toBeDisabled())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeDisabled()

    Received element is not disabled:
      <View
        testID="enabled-view"
      />"
  `);

  expect(screen.getByTestId('disabled-parent')).not.toBeEnabled();
  expect(screen.getByTestId('disabled-child')).not.toBeEnabled();
  expect(screen.getByTestId('enabled-view')).toBeEnabled();
  expect(screen.getByTestId('enabled-text')).toBeEnabled();
  expect(screen.getByTestId('enabled-text-input')).toBeEnabled();
  expect(screen.getByTestId('enabled-pressable')).toBeEnabled();

  expect(() => expect(screen.getByTestId('disabled-parent')).toBeEnabled())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeEnabled()

    Received element is not enabled:
      <View
        aria-disabled={true}
        testID="disabled-parent"
      />"
  `);

  expect(() => expect(screen.getByTestId('enabled-view')).not.toBeEnabled())
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeEnabled()

    Received element is enabled:
      <View
        testID="enabled-view"
      />"
  `);
});

test('toBeDisabled()/toBeEnabled() supports Pressable with "disabled" prop', async () => {
  await render(
    <Pressable disabled testID="subject">
      <Text>Button</Text>
    </Pressable>,
  );

  const pressable = screen.getByTestId('subject');
  expect(pressable).toBeDisabled();
  expect(pressable).not.toBeEnabled();

  const title = screen.getByText('Button');
  expect(title).toBeDisabled();
  expect(title).not.toBeEnabled();

  expect(() => expect(pressable).toBeEnabled()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeEnabled()

    Received element is not enabled:
      <View
        accessibilityState={
          {
            "disabled": true,
          }
        }
        accessible={true}
        testID="subject"
      />"
  `);

  expect(() => expect(pressable).not.toBeDisabled()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeDisabled()

    Received element is disabled:
      <View
        accessibilityState={
          {
            "disabled": true,
          }
        }
        accessible={true}
        testID="subject"
      />"
  `);

  expect(() => expect(title).toBeEnabled()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toBeEnabled()

    Received element is not enabled:
      <Text>
        Button
      </Text>"
  `);

  expect(() => expect(title).not.toBeDisabled()).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toBeDisabled()

    Received element is disabled:
      <Text>
        Button
      </Text>"
  `);
});

test.each([
  ['Pressable', Pressable],
  ['TouchableOpacity', TouchableOpacity],
  ['TouchableHighlight', TouchableHighlight],
  ['TouchableWithoutFeedback', TouchableWithoutFeedback],
  ['TouchableNativeFeedback', TouchableNativeFeedback],
] as const)(
  'toBeDisabled()/toBeEnabled() supports %s with "disabled" prop',
  async (_, Component) => {
    await render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - JSX element type 'Component' does not have any construct or call signatures.
      <Component disabled testID="subject">
        <Text>Button</Text>
      </Component>,
    );

    const touchable = screen.getByTestId('subject');
    expect(touchable).toBeDisabled();
    expect(touchable).not.toBeEnabled();

    const title = screen.getByText('Button');
    expect(title).toBeDisabled();
    expect(title).not.toBeEnabled();

    expect(() => expect(touchable).toBeEnabled()).toThrow();
    expect(() => expect(touchable).not.toBeDisabled()).toThrow();
    expect(() => expect(title).toBeEnabled()).toThrow();
    expect(() => expect(title).not.toBeDisabled()).toThrow();
  },
);

test.each([
  ['View', View],
  ['Text', Text],
  ['TextInput', TextInput],
  ['Pressable', Pressable],
  ['TouchableOpacity', TouchableOpacity],
  ['TouchableWithoutFeedback', TouchableWithoutFeedback],
  ['TouchableNativeFeedback', TouchableNativeFeedback],
] as const)(
  'toBeDisabled()/toBeEnabled() supports %s with "aria-disabled" prop',
  async (_, Component) => {
    await render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - JSX element type 'Component' does not have any construct or call signatures.
      <Component testID="subject" aria-disabled>
        <Text>Hello</Text>
      </Component>,
    );

    const view = screen.getByTestId('subject');
    expect(view).toBeDisabled();
    expect(view).not.toBeEnabled();
    expect(() => expect(view).toBeEnabled()).toThrow();
    expect(() => expect(view).not.toBeDisabled()).toThrow();
  },
);

test.each([
  ['View', View],
  ['Text', Text],
  ['TextInput', TextInput],
  ['Pressable', Pressable],
  ['TouchableOpacity', TouchableOpacity],
  ['TouchableHighlight', TouchableHighlight],
  ['TouchableWithoutFeedback', TouchableWithoutFeedback],
  ['TouchableNativeFeedback', TouchableNativeFeedback],
] as const)(
  'toBeDisabled()/toBeEnabled() supports %s with "accessibilityState.disabled" prop',
  async (_, Component) => {
    await render(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore - JSX element type 'Component' does not have any construct or call signatures.
      <Component testID="subject" accessibilityState={{ disabled: true }}>
        <Text>Hello</Text>
      </Component>,
    );

    const view = screen.getByTestId('subject');
    expect(view).toBeDisabled();
    expect(view).not.toBeEnabled();
    expect(() => expect(view).toBeEnabled()).toThrow();
    expect(() => expect(view).not.toBeDisabled()).toThrow();
  },
);

test('toBeDisabled()/toBeEnabled() supports "editable" prop on TextInput', async () => {
  await render(
    <View>
      <TextInput testID="enabled-by-default" />
      <TextInput testID="enabled" editable />
      <TextInput testID="disabled" editable={false} />
    </View>,
  );

  expect(screen.getByTestId('enabled-by-default')).not.toBeDisabled();
  expect(screen.getByTestId('enabled')).not.toBeDisabled();
  expect(screen.getByTestId('disabled')).toBeDisabled();

  expect(screen.getByTestId('enabled-by-default')).toBeEnabled();
  expect(screen.getByTestId('enabled')).toBeEnabled();
  expect(screen.getByTestId('disabled')).not.toBeEnabled();
});

test('toBeDisabled()/toBeEnabled() supports "disabled" prop on Button', async () => {
  await render(
    <View>
      <Button testID="enabled" title="enabled" />
      <Button testID="disabled" title="disabled" disabled />
    </View>,
  );

  expect(screen.getByTestId('enabled')).not.toBeDisabled();
  expect(screen.getByTestId('disabled')).toBeDisabled();

  expect(screen.getByTestId('enabled')).toBeEnabled();
  expect(screen.getByTestId('disabled')).not.toBeEnabled();
});
