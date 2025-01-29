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

test('detects host Text component', () => {
  render(<Text>Hello</Text>);
  expect(isHostText(screen.root)).toBe(true);
});

// Some users might use the raw RCTText component directly for performance reasons.
// See: https://blog.theodo.com/2023/10/native-views-rn-performance/
test('detects raw RCTText component', () => {
  render(React.createElement('RCTText', { testID: 'text' }, 'Hello'));
  expect(isHostText(screen.root)).toBe(true);
});

test('detects host TextInput component', () => {
  render(<TextInput />);
  expect(isHostTextInput(screen.root)).toBe(true);
});

test('detects host Image component', () => {
  render(<Image />);
  expect(isHostImage(screen.root)).toBe(true);
});

test('detects host Switch component', () => {
  render(<Switch />);
  expect(isHostSwitch(screen.root)).toBe(true);
});

test('detects host ScrollView component', () => {
  render(<ScrollView />);
  expect(isHostScrollView(screen.root)).toBe(true);
});

test('detects host Modal component', () => {
  render(<Modal />);
  expect(isHostModal(screen.root)).toBe(true);
});
