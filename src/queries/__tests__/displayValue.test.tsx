import * as React from 'react';
import { TextInput, View } from 'react-native';

import { render } from '../..';

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
  expect(() => getByDisplayValue(DEFAULT_INPUT_CHEF))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: What did you inspect?

    <View>
      <TextInput
        placeholder="Add custom freshness"
        testID="bananaCustomFreshness"
        value="Custom Freshie"
      />
      <TextInput
        defaultValue="What did you inspect?"
        placeholder="Who inspected freshness?"
        testID="bananaChef"
        value="I inspected freshie"
      />
      <TextInput
        defaultValue="What banana?"
      />
      <TextInput
        defaultValue="hello"
        value=""
      />
    </View>"
  `);
  expect(queryByDisplayValue(DEFAULT_INPUT_CHEF)).toBeNull();

  expect(() => getByDisplayValue('hello')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: hello

    <View>
      <TextInput
        placeholder="Add custom freshness"
        testID="bananaCustomFreshness"
        value="Custom Freshie"
      />
      <TextInput
        defaultValue="What did you inspect?"
        placeholder="Who inspected freshness?"
        testID="bananaChef"
        value="I inspected freshie"
      />
      <TextInput
        defaultValue="What banana?"
      />
      <TextInput
        defaultValue="hello"
        value=""
      />
    </View>"
  `);
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
    findByDisplayValue('Display Value', {}, options)
  ).rejects.toBeTruthy();
  await expect(
    findAllByDisplayValue('Display Value', {}, options)
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

test('byDisplayValue queries support hidden option', () => {
  const { getByDisplayValue, queryByDisplayValue } = render(
    <TextInput value="hidden" style={{ display: 'none' }} />
  );

  expect(
    getByDisplayValue('hidden', { includeHiddenElements: true })
  ).toBeTruthy();

  expect(queryByDisplayValue('hidden')).toBeFalsy();
  expect(
    queryByDisplayValue('hidden', { includeHiddenElements: false })
  ).toBeFalsy();
  expect(() => getByDisplayValue('hidden', { includeHiddenElements: false }))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: hidden

    <TextInput
      style={
        {
          "display": "none",
        }
      }
      value="hidden"
    />"
  `);
});

test('byDisplayValue should return host component', () => {
  const { getByDisplayValue } = render(<TextInput value="value" />);

  expect(getByDisplayValue('value').type).toBe('TextInput');
});

test('error message renders the element tree, preserving only helpful props', async () => {
  const view = render(<TextInput value="1" key="3" />);

  expect(() => view.getByDisplayValue('2')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);

  expect(() => view.getAllByDisplayValue('2'))
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);

  await expect(view.findByDisplayValue('2')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);

  await expect(view.findAllByDisplayValue('2')).rejects
    .toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);
});
