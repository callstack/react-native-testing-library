import * as React from 'react';
import { Text } from 'react-native';
import render from '../../render';
import { getTextContent } from '../getTextContent';

test('getTextContent with simple content', () => {
  const view = render(<Text>Hello world</Text>);
  expect(getTextContent(view.root)).toBe('Hello world');
});

test('getTextContent with null element', () => {
  expect(getTextContent(null)).toBe('');
});

test('getTextContent with single nested content', () => {
  const view = render(
    <Text>
      <Text>Hello world</Text>
    </Text>
  );
  expect(getTextContent(view.root)).toBe('Hello world');
});

test('getTextContent with multiple nested content', () => {
  const view = render(
    <Text>
      <Text>Hello</Text> <Text>world</Text>
    </Text>
  );
  expect(getTextContent(view.root)).toBe('Hello world');
});

test('getTextContent with multiple number content', () => {
  const view = render(
    <Text>
      <Text>Hello</Text> <Text>world</Text> <Text>{100}</Text>
    </Text>
  );
  expect(getTextContent(view.root)).toBe('Hello world 100');
});

test('getTextContent with multiple boolean content', () => {
  const view = render(
    <Text>
      <Text>Hello{false}</Text> <Text>{true}world</Text>
    </Text>
  );
  expect(getTextContent(view.root)).toBe('Hello world');
});
