import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import '../extend-expect';

test('toContainElement() supports basic case', () => {
  render(
    <View testID="parent">
      <View testID="child" />
    </View>
  );

  const parent = screen.getByTestId('parent');
  const child = screen.getByTestId('child');

  expect(parent).toContainElement(child);

  expect(() => expect(parent).not.toContainElement(child))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).not.toContainElement(element)

      <View
        testID="parent"
      /> 

    contains:

       <View
        testID="child"
      />
            "
  `);
});

test('toContainElement() supports negative case', () => {
  render(
    <>
      <View testID="view1" />
      <View testID="view2" />
    </>
  );

  const view1 = screen.getByTestId('view1');
  const view2 = screen.getByTestId('view2');

  expect(view1).not.toContainElement(view2);

  expect(() => expect(view1).toContainElement(view2))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toContainElement(element)

      <View
        testID="view1"
      /> 

    does not contain:

       <View
        testID="view2"
      />
            "
  `);
});

test('toContainElement() passing null', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');

  expect(view).not.toContainElement(null);

  expect(() => expect(view).toContainElement(null))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(element).toContainElement(element)

      <View
        testID="view"
      /> 

    does not contain:

       null
            "
  `);
});

test('toContainElement() on null elements', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');

  expect(() => expect(null).toContainElement(view))
    .toThrowErrorMatchingInlineSnapshot(`
      "expect(received).toContainElement()

      received value must be a host element.
      Received has value: null"
    `);
});

test('toContainElement() on non-React elements', () => {
  render(<View testID="view" />);

  const view = screen.getByTestId('view');

  expect(() => expect({ name: 'Non-React element' }).not.toContainElement(view))
    .toThrowErrorMatchingInlineSnapshot(`
    "expect(received).not.toContainElement()

    received value must be a host element.
    Received has type:  object
    Received has value: {"name": "Non-React element"}"
  `);

  expect(() => expect(true).not.toContainElement(view))
    .toThrowErrorMatchingInlineSnapshot(`
      "expect(received).not.toContainElement()

      received value must be a host element.
      Received has type:  boolean
      Received has value: true"
    `);
});
