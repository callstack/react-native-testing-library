import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { render, screen } from '../..';

const styles = StyleSheet.create({
  container: { borderBottomColor: 'white' },
});

test('toHaveStyle() handles basic cases', () => {
  render(
    <View
      testID="view"
      style={[
        {
          backgroundColor: 'blue',
          height: '40%',
          transform: [{ scale: 2 }, { rotate: '45deg' }],
        },
        [{ height: '100%' }],
        [[{ width: '50%' }]],
        styles.container,
      ]}
    />,
  );

  const view = screen.getByTestId('view');
  expect(view).toHaveStyle({ backgroundColor: 'blue' });
  expect(view).toHaveStyle({ height: '100%' });
  expect(view).toHaveStyle({ backgroundColor: 'blue', height: '100%' });
  expect(view).toHaveStyle([{ backgroundColor: 'blue' }, { height: '100%' }]);

  expect(view).toHaveStyle({ borderBottomColor: 'white' });
  expect(view).toHaveStyle({ width: '50%' });
  expect(view).toHaveStyle([[{ width: '50%' }]]);
  expect(view).toHaveStyle({
    transform: [{ scale: 2 }, { rotate: '45deg' }],
  });

  expect(view).not.toHaveStyle({ backgroundColor: 'red' });
  expect(view).not.toHaveStyle({ height: '50%' });
  expect(view).not.toHaveStyle({ backgroundColor: 'blue', height: '50%' });
  expect(view).not.toHaveStyle([{ backgroundColor: 'blue' }, { height: '50%' }]);
  expect(view).not.toHaveStyle({
    transform: [{ scale: 2 }],
  });
  expect(view).not.toHaveStyle({
    transform: [{ rotate: '45deg' }, { scale: 2 }],
  });
});

test('toHaveStyle error messages', () => {
  render(
    <View
      testID="view"
      style={{
        backgroundColor: 'blue',
        borderBottomColor: 'black',
        height: '100%',
        transform: [{ scale: 2 }, { rotate: '45deg' }],
      }}
    />,
  );

  const view = screen.getByTestId('view');
  expect(() => expect(view).toHaveStyle({ backgroundColor: 'red' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveStyle()

    - Expected
    + Received

    - backgroundColor: red;
    + backgroundColor: blue;"
  `);

  expect(() =>
    expect(view).toHaveStyle({
      backgroundColor: 'blue',
      transform: [{ scale: 1 }],
    }),
  ).toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveStyle()

    - Expected
    + Received

      backgroundColor: blue;
      transform: [
        {
    -     "scale": 1
    +     "scale": 2
    +   },
    +   {
    +     "rotate": "45deg"
        }
      ];"
  `);

  expect(() => expect(view).not.toHaveStyle({ backgroundColor: 'blue' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveStyle()

    Expected element not to have style:
      backgroundColor: blue;
    Received:
      backgroundColor: blue;"
  `);

  expect(() => expect(view).toHaveStyle({ fontWeight: 'bold' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveStyle()

    - Expected
    + Received

    - fontWeight: bold;"
  `);

  expect(() => expect(view).not.toHaveStyle({ backgroundColor: 'blue' }))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toHaveStyle()

    Expected element not to have style:
      backgroundColor: blue;
    Received:
      backgroundColor: blue;"
  `);
});

test('toHaveStyle() supports missing "style" prop', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');
  expect(view).not.toHaveStyle({ fontWeight: 'bold' });
});

test('toHaveStyle() supports undefined "transform" style', () => {
  render(
    <View
      testID="view"
      style={{
        backgroundColor: 'blue',
        transform: undefined,
      }}
    />,
  );

  const view = screen.getByTestId('view');
  expect(() => expect(view).toHaveStyle({ transform: [{ scale: 1 }] }))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toHaveStyle()

    - Expected
    + Received

    - transform: [
    -   {
    -     "scale": 1
    -   }
    - ];
    + transform: undefined;"
  `);
});

test('toHaveStyle() supports Pressable with function "style" prop', () => {
  render(<Pressable testID="view" style={() => ({ backgroundColor: 'blue' })} />);

  expect(screen.getByTestId('view')).toHaveStyle({ backgroundColor: 'blue' });
});
