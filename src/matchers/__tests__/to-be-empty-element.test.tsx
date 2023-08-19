import React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('.toBeEmptyElement', () => {
  render(
    <View testID="not-empty">
      <View testID="empty" />
    </View>
  );

  const empty = screen.getByTestId('empty');
  const notEmpty = screen.queryByTestId('not-empty');
  const nonExistentElement = screen.queryByTestId('not-exists');
  const fakeElement = { thisIsNot: 'an html element' };

  expect(empty).toBeEmptyElement();
  expect(notEmpty).not.toBeEmptyElement();

  expect(() => expect(empty).not.toBeEmptyElement()).toThrow();

  expect(() => expect(notEmpty).toBeEmptyElement()).toThrow();

  expect(() => expect(fakeElement).toBeEmptyElement()).toThrow();

  expect(() => {
    expect(nonExistentElement).toBeEmptyElement();
  }).toThrow();
});
