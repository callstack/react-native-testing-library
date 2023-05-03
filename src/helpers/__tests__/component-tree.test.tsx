import React from 'react';
import { View, Text, TextInput } from 'react-native';
import { render } from '../..';
import {
  getHostChildren,
  getHostParent,
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

describe('getHostParent()', () => {
  it('returns host parent for host component', () => {
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

  it('returns host parent for null', () => {
    expect(getHostParent(null)).toBe(null);
  });

  it('returns host parent for composite component', () => {
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
});

describe('getHostChildren()', () => {
  it('returns host children for host component', () => {
    const view = render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="subject" />
          <Text testID="sibling">Hello</Text>
        </View>
      </View>
    );

    const hostSubject = view.getByTestId('subject');
    expect(getHostChildren(hostSubject)).toEqual([]);

    const hostSibling = view.getByTestId('sibling');
    expect(getHostChildren(hostSibling)).toEqual([]);

    const hostParent = view.getByTestId('parent');
    expect(getHostChildren(hostParent)).toEqual([hostSubject, hostSibling]);

    const hostGrandparent = view.getByTestId('grandparent');
    expect(getHostChildren(hostGrandparent)).toEqual([hostParent]);
  });

  it('returns host children for composite component', () => {
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
});

describe('getHostSelves()', () => {
  it('returns passed element for host components', () => {
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

  test('returns single host element for React Native composite components', () => {
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

  test('returns host children for custom composite components', () => {
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
});

describe('getHostSiblings()', () => {
  it('returns host siblings for host component', () => {
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

  it('returns host siblings for composite component', () => {
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
});
