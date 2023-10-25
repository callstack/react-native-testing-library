import * as React from 'react';
import { View, TextInput } from 'react-native';
import { render } from '../..';

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

test('getByPlaceholderText, queryByPlaceholderText', () => {
  const { getByPlaceholderText, queryByPlaceholderText } = render(<Banana />);
  const input = getByPlaceholderText(/custom/i);

  expect(input.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);

  const sameInput = getByPlaceholderText(PLACEHOLDER_FRESHNESS);

  expect(sameInput.props.placeholder).toBe(PLACEHOLDER_FRESHNESS);
  expect(() => getByPlaceholderText('no placeholder')).toThrow(
    'Unable to find an element with placeholder: no placeholder'
  );

  expect(queryByPlaceholderText(/add/i)).toBe(input);
  expect(queryByPlaceholderText('no placeholder')).toBeNull();
  expect(() => queryByPlaceholderText(/fresh/)).toThrow(
    'Found multiple elements with placeholder: /fresh/ '
  );
});

test('getAllByPlaceholderText, queryAllByPlaceholderText', () => {
  const { getAllByPlaceholderText, queryAllByPlaceholderText } = render(
    <Banana />
  );
  const inputs = getAllByPlaceholderText(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => getAllByPlaceholderText('no placeholder')).toThrow(
    'Unable to find an element with placeholder: no placeholder'
  );

  expect(queryAllByPlaceholderText(/fresh/i)).toEqual(inputs);
  expect(queryAllByPlaceholderText('no placeholder')).toHaveLength(0);
});

test('byPlaceholderText queries support hidden option', () => {
  const { getByPlaceholderText, queryByPlaceholderText } = render(
    <TextInput placeholder="hidden" style={{ display: 'none' }} />
  );

  expect(
    getByPlaceholderText('hidden', { includeHiddenElements: true })
  ).toBeTruthy();

  expect(queryByPlaceholderText('hidden')).toBeFalsy();
  expect(
    queryByPlaceholderText('hidden', { includeHiddenElements: false })
  ).toBeFalsy();
  expect(() => getByPlaceholderText('hidden', { includeHiddenElements: false }))
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

test('byPlaceHolderText should return host component', () => {
  const { getByPlaceholderText } = render(
    <TextInput placeholder="placeholder" />
  );

  expect(getByPlaceholderText('placeholder').type).toBe('TextInput');
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(<TextInput placeholder="PLACEHOLDER" key="3" />);

  expect(() => view.getByPlaceholderText('FOO'))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);

  expect(() => view.getAllByPlaceholderText('FOO'))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);

  await expect(view.findByPlaceholderText('FOO')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);

  await expect(view.findAllByPlaceholderText('FOO')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with placeholder: FOO

    <TextInput
      placeholder="PLACEHOLDER"
    />"
  `);
});
