import React from 'react';
import { Button, Text, View } from 'react-native';
import { render } from '../..';
import '../extend-expect';

test('.toHaveProp', () => {
  const { queryByTestId } = render(
    <View style={null} testID="view">
      <Text allowFontScaling={false} testID="text" ellipsizeMode="head">
        text
      </Text>
      <Button disabled testID="button" title="ok" />
    </View>
  );

  expect(queryByTestId('button')).toHaveProp('accessibilityState', {
    disabled: true,
  });
  expect(queryByTestId('text')).toHaveProp('ellipsizeMode', 'head');
  expect(queryByTestId('text')).toHaveProp('allowFontScaling', false);

  expect(queryByTestId('button')).not.toHaveProp('accessibilityStates');
  expect(queryByTestId('button')).not.toHaveProp('ellipsizeMode', undefined);
  expect(queryByTestId('button')).not.toHaveProp('allowFontScaling', false);
  expect(queryByTestId('text')).not.toHaveProp('style');

  // title is no longer findable as it is a React child
  expect(() =>
    expect(queryByTestId('button')).toHaveProp('title', 'ok')
  ).toThrow();
  expect(() =>
    expect(queryByTestId('button')).toHaveProp('disabled')
  ).toThrow();
  expect(() =>
    expect(queryByTestId('text')).not.toHaveProp('allowFontScaling', false)
  ).toThrow();
  expect(() => expect(queryByTestId('text')).toHaveProp('style')).toThrow();
  expect(() =>
    expect(queryByTestId('text')).toHaveProp('allowFontScaling', 'wrongValue')
  ).toThrow();

  expect(queryByTestId('view')).toHaveProp('style', null);
});
