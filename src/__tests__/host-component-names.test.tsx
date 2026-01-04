import * as React from 'react';
import { Image, Modal, ScrollView, Switch, Text, TextInput } from 'react-native';

import { render, screen } from '..';
import {
  isHostImage,
  isHostModal,
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
