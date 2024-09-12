import * as React from 'react';
import { TextInput, View } from 'react-native';
import { render, screen } from '../..';
import '../../matchers/extend-expect';

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
  render(<Banana />);

  const input = screen.getByDisplayValue(/custom/i);
  expect(input).toHaveDisplayValue(INPUT_FRESHNESS);

  const sameInput = screen.getByDisplayValue(INPUT_FRESHNESS);
  expect(sameInput).toHaveDisplayValue(INPUT_FRESHNESS);
  expect(() => screen.getByDisplayValue('no value')).toThrow(
    'Unable to find an element with displayValue: no value',
  );

  expect(screen.queryByDisplayValue(/custom/i)).toBe(input);
  expect(screen.queryByDisplayValue('no value')).toBeNull();
  expect(() => screen.queryByDisplayValue(/fresh/i)).toThrow(
    'Found multiple elements with display value: /fresh/i',
  );
});

test('getByDisplayValue, queryByDisplayValue get element by default value only when value is undefined', () => {
  render(<Banana />);
  expect(() => screen.getByDisplayValue(DEFAULT_INPUT_CHEF)).toThrowErrorMatchingInlineSnapshot(`
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
  expect(screen.queryByDisplayValue(DEFAULT_INPUT_CHEF)).toBeNull();

  expect(() => screen.getByDisplayValue('hello')).toThrowErrorMatchingInlineSnapshot(`
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
  expect(screen.queryByDisplayValue('hello')).toBeNull();

  expect(screen.getByDisplayValue(DEFAULT_INPUT_CUSTOMER)).toBeTruthy();
  expect(screen.queryByDisplayValue(DEFAULT_INPUT_CUSTOMER)).toBeTruthy();
});

test('getAllByDisplayValue, queryAllByDisplayValue', () => {
  render(<Banana />);
  const inputs = screen.getAllByDisplayValue(/fresh/i);

  expect(inputs).toHaveLength(2);
  expect(() => screen.getAllByDisplayValue('no value')).toThrow(
    'Unable to find an element with displayValue: no value',
  );

  expect(screen.queryAllByDisplayValue(/fresh/i)).toEqual(inputs);
  expect(screen.queryAllByDisplayValue('no value')).toHaveLength(0);
});

test('findBy queries work asynchronously', async () => {
  const options = { timeout: 10 }; // Short timeout so that this test runs quickly
  render(<View />);

  await expect(screen.findByDisplayValue('Display Value', {}, options)).rejects.toBeTruthy();
  await expect(screen.findAllByDisplayValue('Display Value', {}, options)).rejects.toBeTruthy();

  setTimeout(
    () =>
      screen.rerender(
        <View>
          <TextInput value="Display Value" />
        </View>,
      ),
    20,
  );

  await expect(screen.findByDisplayValue('Display Value')).resolves.toBeTruthy();
  await expect(screen.findAllByDisplayValue('Display Value')).resolves.toHaveLength(1);
}, 20000);

test('byDisplayValue queries support hidden option', () => {
  render(<TextInput value="hidden" style={{ display: 'none' }} />);

  expect(screen.getByDisplayValue('hidden', { includeHiddenElements: true })).toBeTruthy();

  expect(screen.queryByDisplayValue('hidden')).toBeFalsy();
  expect(screen.queryByDisplayValue('hidden', { includeHiddenElements: false })).toBeFalsy();
  expect(() => screen.getByDisplayValue('hidden', { includeHiddenElements: false }))
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
  render(<TextInput value="value" />);

  expect(screen.getByDisplayValue('value').type).toBe('TextInput');
});

test('error message renders the element tree, preserving only helpful props', async () => {
  render(<TextInput value="1" key="3" />);

  expect(() => screen.getByDisplayValue('2')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);

  expect(() => screen.getAllByDisplayValue('2')).toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);

  await expect(screen.findByDisplayValue('2')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);

  await expect(screen.findAllByDisplayValue('2')).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with displayValue: 2

    <TextInput
      value="1"
    />"
  `);
});
