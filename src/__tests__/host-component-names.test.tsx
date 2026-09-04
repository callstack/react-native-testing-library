import * as React from 'react';
import { Image, Modal, ScrollView, Switch, Text, TextInput } from 'react-native';
import { PlainText } from 'react-native-plain-text';

import { render, screen } from '..';
import {
  isHostImage,
  isHostModal,
  isHostPlainText,
  isHostScrollView,
  isHostSwitch,
  isHostText,
  isHostTextInput,
} from '../helpers/host-component-names';

test('detects host Text component', async () => {
  await render(<Text>Hello</Text>);
  expect(isHostText(screen.root)).toBe(true);
});

// Some users might use the raw RCTText component directly for performance reasons.
// See: https://blog.theodo.com/2023/10/native-views-rn-performance/
test('detects raw RCTText component', async () => {
  await render(React.createElement('RCTText', { testID: 'text' }, 'Hello'));
  expect(isHostText(screen.root)).toBe(true);
});

// Plain text components, e.g. `<PlainText>` from `react-native-plain-text`,
// hold their content in the `text` prop instead of string children.
test('detects host plain text component', async () => {
  await render(<PlainText>Hello</PlainText>);
  expect(isHostText(screen.root)).toBe(true);
  expect(isHostPlainText(screen.root)).toBe(true);
});

test('does not detect host Text component as plain text', async () => {
  await render(<Text>Hello</Text>);
  expect(isHostPlainText(screen.root)).toBe(false);
});

test('detects host TextInput component', async () => {
  await render(<TextInput />);
  expect(isHostTextInput(screen.root)).toBe(true);
});

test('detects host Image component', async () => {
  await render(<Image />);
  expect(isHostImage(screen.root)).toBe(true);
});

test('detects host Switch component', async () => {
  await render(<Switch />);
  expect(isHostSwitch(screen.root)).toBe(true);
});

test('detects host ScrollView component', async () => {
  await render(<ScrollView />);
  expect(isHostScrollView(screen.root)).toBe(true);
});

test('detects host Modal component', async () => {
  await render(<Modal />);
  expect(isHostModal(screen.root)).toBe(true);
});
