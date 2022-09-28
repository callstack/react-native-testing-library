import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '../..';
import {
  getHostChildren,
  getHostParent,
  getHostSelf,
  getHostSelves,
  getHostSiblings,
} from '../component-tree';

function ZeroHostChildren() {
  return <></>;
}

function MultipleHostChildren() {
  return (
    <>
      <View testID="child1" />
      <View testID="child2" />
      <View testID="child3" />
    </>
  );
}

test('returns host parent for host component', () => {
  const view = render(
    <View testID="grandparent">
      <View testID="parent">
        <View testID="subject" />
        <View testID="sibling" />
      </View>
    </View>
  );

  const hostParent = getHostParent(view.getByTestId('subject'));
  expect(hostParent).toBe(view.getByTestId('parent'));

  const hostGrandparent = getHostParent(hostParent);
  expect(hostGrandparent).toBe(view.getByTestId('grandparent'));

  expect(getHostParent(hostGrandparent)).toBe(null);
});

test('returns host parent for composite component', () => {
  const view = render(
    <View testID="parent">
      <MultipleHostChildren />
      <View testID="subject" />
    </View>
  );

  const compositeComponent = view.UNSAFE_getByType(MultipleHostChildren);
  const hostParent = getHostParent(compositeComponent);
  expect(hostParent).toBe(view.getByTestId('parent'));
});

test('returns host children for host component', () => {
  const view = render(
    <View testID="grandparent">
      <View testID="parent">
        <View testID="subject" />
        <View testID="sibling" />
      </View>
    </View>
  );

  const hostSubject = view.getByTestId('subject');
  expect(getHostChildren(hostSubject)).toEqual([]);

  const hostSibling = view.getByTestId('sibling');
  const hostParent = view.getByTestId('parent');
  expect(getHostChildren(hostParent)).toEqual([hostSubject, hostSibling]);

  const hostGrandparent = view.getByTestId('grandparent');
  expect(getHostChildren(hostGrandparent)).toEqual([hostParent]);
});

test('returns host children for composite component', () => {
  const view = render(
    <View testID="parent">
      <MultipleHostChildren />
      <View testID="subject" />
      <View testID="sibling" />
    </View>
  );

  expect(getHostChildren(view.getByTestId('parent'))).toEqual([
    view.getByTestId('child1'),
    view.getByTestId('child2'),
    view.getByTestId('child3'),
    view.getByTestId('subject'),
    view.getByTestId('sibling'),
  ]);
});

test('returns host self for host components', () => {
  const view = render(
    <View testID="grandparent">
      <View testID="parent">
        <View testID="subject" />
        <View testID="sibling" />
      </View>
    </View>
  );

  const hostSubject = view.getByTestId('subject');
  expect(getHostSelf(hostSubject)).toEqual(hostSubject);

  const hostSibling = view.getByTestId('sibling');
  expect(getHostSelf(hostSibling)).toEqual(hostSibling);

  const hostParent = view.getByTestId('parent');
  expect(getHostSelf(hostParent)).toEqual(hostParent);

  const hostGrandparent = view.getByTestId('grandparent');
  expect(getHostSelf(hostGrandparent)).toEqual(hostGrandparent);
});

test('returns host selves for host components', () => {
  const view = render(
    <View testID="grandparent">
      <View testID="parent">
        <View testID="subject" />
        <View testID="sibling" />
      </View>
    </View>
  );

  const hostSubject = view.getByTestId('subject');
  expect(getHostSelves(hostSubject)).toEqual([hostSubject]);

  const hostSibling = view.getByTestId('sibling');
  expect(getHostSelves(hostSibling)).toEqual([hostSibling]);

  const hostParent = view.getByTestId('parent');
  expect(getHostSelves(hostParent)).toEqual([hostParent]);

  const hostGrandparent = view.getByTestId('grandparent');
  expect(getHostSelves(hostGrandparent)).toEqual([hostGrandparent]);
});

test('returns host self for React Native composite components', () => {
  const view = render(
    <View testID="parent">
      <Text testID="text">Text</Text>
      <TextInput
        testID="textInput"
        defaultValue="TextInputValue"
        placeholder="TextInputPlaceholder"
      />
    </View>
  );

  const compositeText = view.getByText('Text');
  const hostText = view.getByTestId('text');
  expect(getHostSelf(compositeText)).toEqual(hostText);

  const compositeTextInputByValue = view.getByDisplayValue('TextInputValue');
  const compositeTextInputByPlaceholder = view.getByPlaceholderText(
    'TextInputPlaceholder'
  );
  const hostTextInput = view.getByTestId('textInput');
  expect(getHostSelf(compositeTextInputByValue)).toEqual(hostTextInput);
  expect(getHostSelf(compositeTextInputByPlaceholder)).toEqual(hostTextInput);
});

test('throws on non-single host self element for custom composite components', () => {
  const view = render(
    <View testID="parent">
      <ZeroHostChildren />
      <MultipleHostChildren />
    </View>
  );

  const zeroCompositeComponent = view.UNSAFE_getByType(ZeroHostChildren);
  expect(() => getHostSelf(zeroCompositeComponent)).toThrow(
    'Expected exactly one host element, but found none.'
  );

  const multipleCompositeComponent =
    view.UNSAFE_getByType(MultipleHostChildren);
  expect(() => getHostSelf(multipleCompositeComponent)).toThrow(
    'Expected exactly one host element, but found 3.'
  );
});

test('returns host selves for React Native composite components', () => {
  const view = render(
    <View testID="parent">
      <Text testID="text">Text</Text>
      <TextInput
        testID="textInput"
        defaultValue="TextInputValue"
        placeholder="TextInputPlaceholder"
      />
    </View>
  );

  const compositeText = view.getByText('Text');
  const hostText = view.getByTestId('text');
  expect(getHostSelves(compositeText)).toEqual([hostText]);

  const compositeTextInputByValue = view.getByDisplayValue('TextInputValue');
  const compositeTextInputByPlaceholder = view.getByPlaceholderText(
    'TextInputPlaceholder'
  );
  const hostTextInput = view.getByTestId('textInput');
  expect(getHostSelves(compositeTextInputByValue)).toEqual([hostTextInput]);
  expect(getHostSelves(compositeTextInputByPlaceholder)).toEqual([
    hostTextInput,
  ]);
});

test('returns host selves for custom composite components', () => {
  const view = render(
    <View testID="parent">
      <ZeroHostChildren />
      <MultipleHostChildren />
      <View testID="sibling" />
    </View>
  );

  const zeroCompositeComponent = view.UNSAFE_getByType(ZeroHostChildren);
  expect(getHostSelves(zeroCompositeComponent)).toEqual([]);

  const multipleCompositeComponent =
    view.UNSAFE_getByType(MultipleHostChildren);
  const hostChild1 = view.getByTestId('child1');
  const hostChild2 = view.getByTestId('child2');
  const hostChild3 = view.getByTestId('child3');
  expect(getHostSelves(multipleCompositeComponent)).toEqual([
    hostChild1,
    hostChild2,
    hostChild3,
  ]);
});

test('returns host siblings for host component', () => {
  const view = render(
    <View testID="grandparent">
      <View testID="parent">
        <View testID="siblingBefore" />
        <View testID="subject" />
        <View testID="siblingAfter" />
        <MultipleHostChildren />
      </View>
    </View>
  );

  const hostSiblings = getHostSiblings(view.getByTestId('subject'));
  expect(hostSiblings).toEqual([
    view.getByTestId('siblingBefore'),
    view.getByTestId('siblingAfter'),
    view.getByTestId('child1'),
    view.getByTestId('child2'),
    view.getByTestId('child3'),
  ]);
});

test('returns host siblings for composite component', () => {
  const view = render(
    <View testID="grandparent">
      <View testID="parent">
        <View testID="siblingBefore" />
        <View testID="subject" />
        <View testID="siblingAfter" />
        <MultipleHostChildren />
      </View>
    </View>
  );

  const compositeComponent = view.UNSAFE_getByType(MultipleHostChildren);
  const hostSiblings = getHostSiblings(compositeComponent);
  expect(hostSiblings).toEqual([
    view.getByTestId('siblingBefore'),
    view.getByTestId('subject'),
    view.getByTestId('siblingAfter'),
  ]);
});
