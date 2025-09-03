import * as React from 'react';
import { Pressable, Text, View } from 'react-native';

import { configure, fireEvent, render, screen } from '..';
import { _console } from '../helpers/logger';

beforeEach(() => {
  jest.spyOn(_console, 'debug').mockImplementation(() => {});
  jest.spyOn(_console, 'info').mockImplementation(() => {});
  jest.spyOn(_console, 'warn').mockImplementation(() => {});
  jest.spyOn(_console, 'error').mockImplementation(() => {});
});

test('should log warning when firing event on element without handler', () => {
  render(
    <View>
      <Text>No handler</Text>
    </View>,
  );

  fireEvent.press(screen.getByText('No handler'));

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ▲ Fire Event: no event handler for "press" event found on <Text>No handler</Text> or any of its ancestors.
    "
  `);
});

test('should log warning when firing event on single disabled element', () => {
  render(
    <View>
      <Pressable onPress={() => {}} disabled>
        <Text>Disabled button</Text>
      </Pressable>
    </View>,
  );

  fireEvent.press(screen.getByText('Disabled button'));

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ▲ Fire Event: no enabled event handler for "press" event found. Found disabled event handler(s) on:
         - <Pressable disabled={true} /> (composite element)
    "
  `);
});

test('should log warning about multiple disabled handlers', () => {
  render(
    <View>
      <Pressable testID="outer" onPress={() => {}} disabled>
        <Pressable testID="inner" onPress={() => {}} disabled>
          <Text>Nested disabled</Text>
        </Pressable>
      </Pressable>
    </View>,
  );

  fireEvent.press(screen.getByText('Nested disabled'));

  expect(_console.warn).toHaveBeenCalledTimes(1);
  expect(jest.mocked(_console.warn).mock.calls[0][0]).toMatchInlineSnapshot(`
    "  ▲ Fire Event: no enabled event handler for "press" event found. Found disabled event handler(s) on:
         - <Pressable disabled={true} testID="inner" /> (composite element)
         - <Pressable disabled={true} testID="outer" /> (composite element)
    "
  `);
});
