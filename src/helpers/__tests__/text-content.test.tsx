import * as React from 'react';
import { Text, View } from 'react-native';
import { PlainText } from 'react-native-plain-text';

import { render, screen } from '../..';
import { getTextContent } from '../text-content';

test('getTextContent with simple content', async () => {
  await render(<Text>Hello world</Text>);
  expect(getTextContent(screen.root)).toBe('Hello world');
});

test('getTextContent with null element', () => {
  expect(getTextContent(null)).toBe('');
});

test('getTextContent with single nested content', async () => {
  await render(
    <Text>
      <Text>Hello world</Text>
    </Text>,
  );
  expect(getTextContent(screen.root)).toBe('Hello world');
});

test('getTextContent with multiple nested content', async () => {
  await render(
    <Text>
      <Text>Hello</Text> <Text>world</Text>
    </Text>,
  );
  expect(getTextContent(screen.root)).toBe('Hello world');
});

test('getTextContent with multiple number content', async () => {
  await render(
    <Text>
      <Text>Hello</Text> <Text>world</Text> <Text>{100}</Text>
    </Text>,
  );
  expect(getTextContent(screen.root)).toBe('Hello world 100');
});

test('getTextContent with multiple boolean content', async () => {
  await render(
    <Text>
      <Text>Hello{false}</Text> <Text>{true}world</Text>
    </Text>,
  );
  expect(getTextContent(screen.root)).toBe('Hello world');
});

test('getTextContent with plain text content', async () => {
  await render(<PlainText>Hello world</PlainText>);
  expect(getTextContent(screen.root)).toBe('Hello world');
});

test('getTextContent with plain text `text` prop', async () => {
  await render(<PlainText text="Hello world" />);
  expect(getTextContent(screen.root)).toBe('Hello world');
});

test('getTextContent with empty plain text', async () => {
  await render(<PlainText />);
  expect(getTextContent(screen.root)).toBe('');
});

test('getTextContent with nested plain text content', async () => {
  await render(
    <View>
      <PlainText>Hello</PlainText>
      <Text> world</Text>
    </View>,
  );
  expect(getTextContent(screen.root)).toBe('Hello world');
});
