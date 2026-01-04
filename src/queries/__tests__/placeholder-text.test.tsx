import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render, screen } from '../..';

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';
const DEFAULT_INPUT_CHEF = 'What did you inspect?';

const Banana = () => (
  <View>
    <TextInput
      testID="bananaCustomFreshness"
      placeholder={PLACEHOLDER_FRESHNESS}
      value={INPUT_FRESHNESS}
    />
    <TextInput
      testID="bananaChef"
      placeholder={PLACEHOLDER_CHEF}
      value={INPUT_CHEF}
      defaultValue={DEFAULT_INPUT_CHEF}
    />
  </View>
);

test('getByPlaceholderText, queryByPlaceholderText', async () => {
  await render(<Banana />);
  const input = screen.getByPlaceholderText(/custom/i);

  expect(input.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);

  const sameInput = screen.getByPlaceholderText(PLACEHOLDER_FRESHNESS);

  expect(sameInput.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);
  expect(() => screen.getByPlaceholderText('no placeholder')).toThrow(
    'Unable to find an element with placeholder: no placeholder',
  );

  expect(screen.queryByPlaceholderText(/add/i)).toBe(input);
  expect(screen.queryByPlaceholderText('no placeholder')).toBeNull();
  expect(() => screen.queryByPlaceholderText(/fresh/)).toThrow(
    'Found multiple elements with placeholder: /fresh/ ',
  );
});

test('getAllByPlaceholderText, queryAllByPlaceholderText', async () => {
  await render(<Banana />);
  const inputs = screen.getAllByPlaceholderText(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => screen.getAllByPlaceholderText('no placeholder')).toThrow(
    'Unable to find an element with placeholder: no placeholder',
  );

  expect(screen.queryAllByPlaceholderText(/fresh/i)).toEqual(inputs);
  expect(screen.queryAllByPlaceholderText('no placeholder')).toHaveLength(0);
});

test('byPlaceholderText queries support hidden option', async () => {
  await render(<TextInput placeholder="hidden" style={{ display: 'none' }} />);

  expect(screen.getByPlaceholderText('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByPlaceholderText('hidden')).toBeFalsy();
  expect(screen.queryByPlaceholderText('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByPlaceholderText('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: hidden

    <TextInput
      placeholder="hidden"
      style={
        {
          "display": "none",
        }
      }
    />"
  `);
});

test('byPlaceHolderText should return host component', async () => {
  await render(<TextInput placeholder="placeholder" />);

  expect(screen.getByPlaceholderText('placeholder').type).toBe('TextInput');
});

test('error message renders the element tree, preserving only helpful props', async () => {
  await render(<TextInput placeholder="PLACEHOLDER" key="3" />);

  expect(() => screen.getByPlaceholderText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);

  expect(() => screen.getAllByPlaceholderText('FOO')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);

  await expect(screen.findByPlaceholderText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);

  await expect(screen.findAllByPlaceholderText('FOO')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);
});
