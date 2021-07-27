// @flow
import * as React from 'react';
import { View, TextInput } from 'react-native';
import { render } from '..';

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

test("queries should respect accessibility", async () => {
  const Comp = () => (
    <View>
      <View accessibilityElementsHidden>
        <TextInput placeholder="hidden" value={INPUT_FRESHNESS} />
      </View>
    </View>
  );

  const { 
    findAllByPlaceholderText,
    findByPlaceholderText,
    getAllByPlaceholderText,
    getByPlaceholderText,
    queryAllByPlaceholderText,
    queryByPlaceholderText
  } = render(<Comp />, {
    respectAccessibility: true,
  });

  await expect(findAllByPlaceholderText("hidden")).rejects.toBeTruthy();
  await expect(findByPlaceholderText("hidden")).rejects.toBeTruthy();
  await expect(() => getAllByPlaceholderText("hidden")).toThrow(
    "Unable to find an element with placeholder: hidden"
  );
  await expect(() => getByPlaceholderText("hidden")).toThrow(
    "Unable to find an element with placeholder: hidden"
  );
  await expect(queryAllByPlaceholderText("hidden")).toHaveLength(0);
  await expect(queryByPlaceholderText("hidden")).toBeNull();
});