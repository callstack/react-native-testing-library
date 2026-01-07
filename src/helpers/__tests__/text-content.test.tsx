import * as React from 'react';
import { Text } from 'react-native';

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
