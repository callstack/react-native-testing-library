import React from 'react';
import { Button, Text, View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('.toHaveProp', () => {
  render(
    <View style={null} testID="view">
      <Text allowFontScaling={false} testID="text" ellipsizeMode="head">
        text
      </Text>
      <Button disabled testID="button" title="ok" />
    </View>
  );

  const text = screen.getByTestId('text');
  const button = screen.getByTestId('button');
  const view = screen.getByTestId('view');

  expect(button).toHaveProp('accessibilityState', {
    disabled: true,
  });
  expect(text).toHaveProp('ellipsizeMode', 'head');
  expect(text).toHaveProp('allowFontScaling', false);

  expect(button).not.toHaveProp('accessibilityStates');
  expect(button).not.toHaveProp('ellipsizeMode', undefined);
  expect(button).not.toHaveProp('allowFontScaling', false);
  expect(text).not.toHaveProp('style');

  // title is no longer findable as it is a React child
  expect(() => expect(button).toHaveProp('title', 'ok'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("title", "ok") // Element should have prop title with value "ok"

    Expected the element to have prop:
      title="ok"
    Received:
      null"
  `);
  expect(() => expect(button).toHaveProp('disabled'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("disabled") // Element should have prop disabled

    Expected the element to have prop:
      disabled
    Received:
      null"
  `);
  expect(() => expect(text).not.toHaveProp('allowFontScaling', false))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveProp("allowFontScaling", false) // Element should have prop allowFontScaling with value false

    Expected the element not to have prop:
      allowFontScaling=false
    Received:
      allowFontScaling=false"
  `);
  expect(() => expect(text).toHaveProp('style'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("style") // Element should have prop style

    Expected the element to have prop:
      style
    Received:
      null"
  `);
  expect(() => expect(text).toHaveProp('allowFontScaling', 'wrongValue'))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveProp("allowFontScaling", "wrongValue") // Element should have prop allowFontScaling with value "wrongValue"

    Expected the element to have prop:
      allowFontScaling="wrongValue"
    Received:
      allowFontScaling=false"
  `);

  expect(view).toHaveProp('style', null);
});
