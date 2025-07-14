import * as React from 'react';
import { render, screen } from '@testing-library/react-native';
import { Text, TextInput, View } from 'react-native';
import { s } from 'react-strict-dom/runtime';

test('showcase: toBeOnTheScreen', () => {
  render(
    <View>
      <View testID="view" />
    </View>,
  );

  expect(screen.getByTestId('view')).toBeOnTheScreen();
  expect(screen.queryByTestId('non-existent')).not.toBeOnTheScreen();
});

test('showcase: toBeIntoHaveTextContentTheDocument', () => {
  render(
    <View>
      <Text testID="text">Hello World</Text>
    </View>,
  );

  expect(screen.getByTestId('text')).toHaveTextContent('Hello World');
  expect(screen.getByTestId('text')).toHaveTextContent(/hello/i);
  expect(screen.getByTestId('text')).toHaveTextContent('Hello', { exact: false });
});

test('showcase: toContainElement', () => {
  render(
    <View>
      <View testID="outer">
        <View testID="inner" />
      </View>
      <View testID="outer-2" />
    </View>,
  );

  expect(screen.getByTestId('outer')).toContainElement(screen.getByTestId('inner'));
  expect(screen.getByTestId('outer')).not.toContainElement(screen.getByTestId('outer-2'));
});

test('showcase: toBeEmptyElement', () => {
  render(
    <View>
      <View testID="empty" />
      <View testID="not-empty">
        <Text testID="text">Hello World</Text>
      </View>
    </View>,
  );

  expect(screen.getByTestId('empty')).toBeEmptyElement();
  expect(screen.getByTestId('not-empty')).not.toBeEmptyElement();
});

test('showcase: toHaveDisplayValue', () => {
  render(
    <View>
      <TextInput testID="input" value="Hello" />
    </View>,
  );

  expect(screen.getByTestId('input')).toHaveDisplayValue('Hello');
});

test('showcase: toHaveAccessibilityValue', () => {
  render(
    <View>
      <View
        testID="view"
        aria-valuetext="33%"
        aria-valuenow={33}
        aria-valuemax={100}
        aria-valuemin={0}
      />
    </View>,
  );

  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ text: '33%' });
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ now: 33 });
  expect(screen.getByTestId('view')).toHaveAccessibilityValue({ now: 33, min: 0, max: 100 });
});

test('showcase: toBeEnabled/toBeDisabled', () => {
  render(
    <View>
      <View testID="enabled" aria-disabled={false} />
      <View testID="disabled" aria-disabled />
    </View>,
  );

  expect(screen.getByTestId('enabled')).toBeEnabled();
  expect(screen.getByTestId('enabled')).not.toBeDisabled();
  expect(screen.getByTestId('disabled')).toBeDisabled();
  expect(screen.getByTestId('disabled')).not.toBeEnabled();
});

test('showcase: toBeSelected', () => {
  render(
    <View>
      <View testID="selected" aria-selected />
      <View testID="not-selected" />
    </View>,
  );

  expect(screen.getByTestId('selected')).toBeSelected();
  expect(screen.getByTestId('not-selected')).not.toBeSelected();
});

test('showcase: toBeChecked/toBePartiallyChecked (role: checkbox)', () => {
  render(
    <View>
      <View accessible role="checkbox" testID="checked" aria-checked />
      <View accessible role="checkbox" testID="partially-checked" aria-checked="mixed" />
      <View accessible role="checkbox" testID="not-checked" />
    </View>,
  );

  expect(screen.getByTestId('checked')).toBeChecked();
  expect(screen.getByTestId('checked')).not.toBePartiallyChecked();

  expect(screen.getByTestId('partially-checked')).toBePartiallyChecked();
  expect(screen.getByTestId('partially-checked')).not.toBeChecked();

  expect(screen.getByTestId('not-checked')).not.toBeChecked();
  expect(screen.getByTestId('not-checked')).not.toBePartiallyChecked();
});

test('showcase: toBeChecked (roles: switch, radio)', () => {
  render(
    <View>
      <View accessible role="switch" testID="checked" aria-checked />
      <View accessible role="radio" testID="not-checked" />
    </View>,
  );

  expect(screen.getByTestId('checked')).toBeChecked();
  expect(screen.getByTestId('not-checked')).not.toBeChecked();
});

test('showcase: toBeBusy', () => {
  render(
    <View>
      <View testID="busy" aria-busy />
      <View testID="not-busy" />
    </View>,
  );

  expect(screen.getByTestId('busy')).toBeBusy();
  expect(screen.getByTestId('not-busy')).not.toBeBusy();
});

test('showcase: toBeExpanded/toBeCollapsed', () => {
  render(
    <View>
      <View testID="expanded" aria-expanded />
      <View testID="collapsed" aria-expanded={false} />
      <View testID="default" />
    </View>,
  );

  expect(screen.getByTestId('expanded')).toBeExpanded();
  expect(screen.getByTestId('expanded')).not.toBeCollapsed();

  expect(screen.getByTestId('collapsed')).toBeCollapsed();
  expect(screen.getByTestId('collapsed')).not.toBeExpanded();

  expect(screen.getByTestId('default')).not.toBeCollapsed();
  expect(screen.getByTestId('default')).not.toBeExpanded();
});

test('showcase: toBeVisible', () => {
  render(
    <View>
      <View testID="visible" />
      <View testID="not-visible" style={{ opacity: 0 }} />
    </View>,
  );

  expect(screen.getByTestId('visible')).toBeVisible();
  expect(screen.getByTestId('not-visible')).not.toBeVisible();
});

test('showcase: toHaveStyle', () => {
  render(
    <View>
      <View testID="view" style={{ backgroundColor: 'red' }} />
    </View>,
  );

  expect(screen.getByTestId('view')).toHaveStyle({ backgroundColor: 'red' });
  expect(screen.getByTestId('view')).not.toHaveStyle({ backgroundColor: 'blue' });
});

test('showcase: toHaveProp', () => {
  render(
    <View>
      <Text testID="text" numberOfLines={1} />
    </View>,
  );

  expect(screen.getByTestId('text')).toHaveProp('numberOfLines');
  expect(screen.getByTestId('text')).not.toHaveProp('adjustsFontSizeToFit');

  expect(screen.getByTestId('text')).toHaveProp('numberOfLines', 1);
  expect(screen.getByTestId('text')).not.toHaveProp('numberOfLines', 5);
});
