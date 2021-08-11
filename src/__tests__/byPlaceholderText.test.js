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

test('queries should respect accessibility', async () => {
  const OtherComp = () => (
    <View>
      <View>
        <TextInput placeholder="test_01" />
      </View>
      <View accessibilityViewIsModal>
        <TextInput placeholder="test_02" />
      </View>
    </View>
  );
  const Comp = () => (
    <View>
      <OtherComp importantForAccessibility="no-hide-descendants" />
      <OtherComp style={{ display: 'none' }} />
      <OtherComp />
      <View>
        <TextInput placeholder="test_02" />
      </View>
      <View>
        <TextInput accessibilityElementsHidden placeholder="test_01" />
      </View>
    </View>
  );

  const {
    findAllByPlaceholderText,
    findByPlaceholderText,
    getAllByPlaceholderText,
    getByPlaceholderText,
    queryAllByPlaceholderText,
    queryByPlaceholderText,
  } = render(<Comp />, {
    respectAccessibility: true,
  });

  await expect(() => getAllByPlaceholderText('test_01')).toThrow(
    'Unable to find an element with placeholder: test_01'
  );
  await expect(getAllByPlaceholderText('test_02')).toHaveLength(2);
  await expect(() => getByPlaceholderText('test_01')).toThrow(
    'Unable to find an element with placeholder: test_01'
  );
  await expect(() => getByPlaceholderText('test_02')).toThrow(
    'Found multiple elements with placeholder: test_02 '
  );
  await expect(queryAllByPlaceholderText('test_01')).toHaveLength(0);
  await expect(queryAllByPlaceholderText('test_02')).toHaveLength(2);
  await expect(queryByPlaceholderText('test_01')).toBeNull();
  await expect(() => queryByPlaceholderText('test_02')).toThrow(
    'Found multiple elements with placeholder: test_02 '
  );
  await expect(findAllByPlaceholderText('test_01')).rejects.toEqual(
    new Error('Unable to find an element with placeholder: test_01')
  );
  await expect(findAllByPlaceholderText('test_02')).resolves.toHaveLength(2);
  await expect(findByPlaceholderText('test_01')).rejects.toEqual(
    new Error('Unable to find an element with placeholder: test_01')
  );
  await expect(findByPlaceholderText('test_02')).rejects.toEqual(
    new Error('Found multiple elements with placeholder: test_02 ')
  );
});
