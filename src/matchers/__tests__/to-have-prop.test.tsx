import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toHaveProp() basic case', () => {
  render(
    <View testID="view" style={null}>
      <Text ellipsizeMode="head">Hello</Text>
      <TextInput testID="input" textAlign="right" />
    </View>
  );

  const view = screen.getByTestId('view');
  expect(view).toHaveProp('style');
  expect(view).toHaveProp('style', null);
  expect(view).not.toHaveProp('ellipsizeMode');

  const text = screen.getByText('Hello');
  expect(text).toHaveProp('ellipsizeMode');
  expect(text).toHaveProp('ellipsizeMode', 'head');
  expect(text).not.toHaveProp('style');
  expect(text).not.toHaveProp('ellipsizeMode', 'tail');

  const input = screen.getByTestId('input');
  expect(input).toHaveProp('textAlign');
  expect(input).toHaveProp('textAlign', 'right');
  expect(input).not.toHaveProp('textAlign', 'left');
  expect(input).not.toHaveProp('editable');
  expect(input).not.toHaveProp('editable', false);
});

test('toHaveProp() error messages', () => {
  render(<View testID="view" collapsable={false} />);

  const view = screen.getByTestId('view');

  expect(() => expect(view).toHaveProp('accessible')).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("accessible")

    Expected element to have prop:
      accessible
    Received:
      undefined"
  `);

  expect(() => expect(view).toHaveProp('accessible', true)).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("accessible", true)

    Expected element to have prop:
      accessible={true}
    Received:
      undefined"
  `);

  expect(() => expect(view).not.toHaveProp('collapsable')).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveProp("collapsable")

    Expected element not to have prop:
      collapsable
    Received:
      collapsable={false}"
  `);

  expect(() => expect(view).toHaveProp('collapsable', true)).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("collapsable", true)

    Expected element to have prop:
      collapsable={true}
    Received:
      collapsable={false}"
  `);

  expect(() => expect(view).not.toHaveProp('collapsable', false))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveProp("collapsable", false)

    Expected element not to have prop:
      collapsable={false}
    Received:
      collapsable={false}"
  `);
});
