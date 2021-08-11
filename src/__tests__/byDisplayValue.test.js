// @flow
import * as React from 'react';
import { View, TextInput } from 'react-native';

import { render } from '..';

const PLACEHOLDER_FRESHNESS = 'Add custom freshness';
const PLACEHOLDER_CHEF = 'Who inspected freshness?';
const INPUT_FRESHNESS = 'Custom Freshie';
const INPUT_CHEF = 'I inspected freshie';
const DEFAULT_INPUT_CHEF = 'What did you inspect?';
const DEFAULT_INPUT_CUSTOMER = 'What banana?';

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
    <TextInput defaultValue={DEFAULT_INPUT_CUSTOMER} />
    <TextInput defaultValue={'hello'} value="" />
  </View>
);

test('getByDisplayValue, queryByDisplayValue', () => {
  const { getByDisplayValue, queryByDisplayValue } = render(<Banana />);
  const input = getByDisplayValue(/custom/i);

  expect(input.props.value).toBe(INPUT_FRESHNESS);

  const sameInput = getByDisplayValue(INPUT_FRESHNESS);

  expect(sameInput.props.value).toBe(INPUT_FRESHNESS);
  expect(() => getByDisplayValue('no value')).toThrow(
    'Unable to find an element with displayValue: no value'
  );

  expect(queryByDisplayValue(/custom/i)).toBe(input);
  expect(queryByDisplayValue('no value')).toBeNull();
  expect(() => queryByDisplayValue(/fresh/i)).toThrow(
    'Found multiple elements with display value: /fresh/i'
  );
});

test('getByDisplayValue, queryByDisplayValue get element by default value only when value is undefined', () => {
  const { getByDisplayValue, queryByDisplayValue } = render(<Banana />);
  expect(() => getByDisplayValue(DEFAULT_INPUT_CHEF)).toThrow();
  expect(queryByDisplayValue(DEFAULT_INPUT_CHEF)).toBeNull();

  expect(() => getByDisplayValue('hello')).toThrow();
  expect(queryByDisplayValue('hello')).toBeNull();

  expect(getByDisplayValue(DEFAULT_INPUT_CUSTOMER)).toBeTruthy();
  expect(queryByDisplayValue(DEFAULT_INPUT_CUSTOMER)).toBeTruthy();
});

test('getAllByDisplayValue, queryAllByDisplayValue', () => {
  const { getAllByDisplayValue, queryAllByDisplayValue } = render(<Banana />);
  const inputs = getAllByDisplayValue(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => getAllByDisplayValue('no value')).toThrow(
    'Unable to find an element with displayValue: no value'
  );

  expect(queryAllByDisplayValue(/fresh/i)).toEqual(inputs);
  expect(queryAllByDisplayValue('no value')).toHaveLength(0);
});

test('findBy queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  const { rerender, findByDisplayValue, findAllByDisplayValue } = render(
    <View />
  );

  await expect(
    findByDisplayValue('Display Value', options)
  ).rejects.toBeTruthy();
  await expect(
    findAllByDisplayValue('Display Value', options)
  ).rejects.toBeTruthy();

  setTimeout(
    () =>
      rerender(
        <View>
          <TextInput value="Display Value" />
        </View>
      ),
    20
  );

  await expect(findByDisplayValue('Display Value')).resolves.toBeTruthy();
  await expect(findAllByDisplayValue('Display Value')).resolves.toHaveLength(1);
}, 20000);

test('all queries should respect accessibility', async () => {
  const OtherComp = () => (
    <View >
      <View>
        <TextInput value="test_01" />
      </View>
    </View>
  );
  const Comp = () => (
    <View>
      <OtherComp importantForAccessibility="no-hide-descendants" />
      <OtherComp style={{display: "none"}} />
      <TextInput value="test_02" />
      <View>
        <TextInput value="test_02" />
      </View>
      <View>
        <TextInput accessibilityElementsHidden value="test_01" />
      </View>
    </View>
  );

  const {
    findAllByDisplayValue,
    findByDisplayValue,
    getAllByDisplayValue,
    queryAllByDisplayValue,
    getByDisplayValue,
    queryByDisplayValue,
  } = render(<Comp />, { respectAccessibility: true });

  await expect(getAllByDisplayValue("test_02")).toHaveLength(2);
  await expect(() => getAllByDisplayValue('test_01')).toThrow(
    'Unable to find an element with displayValue: test_01'
  );
  await expect(() => getByDisplayValue("test_02")).toThrow(
    "Found multiple elements with display value: test_02 "
  );
  await expect(() => getByDisplayValue('test_01')).toThrow(
    'Unable to find an element with displayValue: test_01'
  );
  await expect(queryAllByDisplayValue('test_01')).toHaveLength(0);
  await expect(queryAllByDisplayValue("test_02")).toHaveLength(2);
  await expect(queryByDisplayValue('test_01')).toBeNull();
  await expect(() => queryByDisplayValue("test_02")).toThrow(
    "Found multiple elements with display value: test_02 "
  );
  await expect(findAllByDisplayValue('test_01')).rejects.toEqual(
    new Error("Unable to find an element with displayValue: test_01")
  );
  await expect(findAllByDisplayValue('test_02')).resolves.toHaveLength(2);
  await expect(findByDisplayValue('test_01')).rejects.toEqual(
    new Error("Unable to find an element with displayValue: test_01")
  );
  await expect(findByDisplayValue('test_02')).rejects.toEqual(
    new Error("Found multiple elements with display value: test_02 ")
  );
});
