import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { render, screen } from '../..';
import {
  getHostChildren,
  getHostParent,
  getHostSelves,
  getHostSiblings,
  getUnsafeRootElement,
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
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="subject" />
          <View testID="sibling" />
        </View>
      </View>
    );

    const hostParent = getHostParent(screen.getByTestId('subject'));
    expect(hostParent).toBe(screen.getByTestId('parent'));

    const hostGrandparent = getHostParent(hostParent);
    expect(hostGrandparent).toBe(screen.getByTestId('grandparent'));

    expect(getHostParent(hostGrandparent)).toBe(null);
  });

  it('returns host parent for null', () => {
    expect(getHostParent(null)).toBe(null);
  });

  it('returns host parent for composite component', () => {
    render(
      <View testID="parent">
        <MultipleHostChildren />
        <View testID="subject" />
      </View>
    );

    const compositeComponent = screen.UNSAFE_getByType(MultipleHostChildren);
    const hostParent = getHostParent(compositeComponent);
    expect(hostParent).toBe(screen.getByTestId('parent'));
  });
});

describe('getHostChildren()', () => {
  it('returns host children for host component', () => {
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="subject" />
          <Text testID="sibling">Hello</Text>
        </View>
      </View>
    );

    const hostSubject = screen.getByTestId('subject');
    expect(getHostChildren(hostSubject)).toEqual([]);

    const hostSibling = screen.getByTestId('sibling');
    expect(getHostChildren(hostSibling)).toEqual([]);

    const hostParent = screen.getByTestId('parent');
    expect(getHostChildren(hostParent)).toEqual([hostSubject, hostSibling]);

    const hostGrandparent = screen.getByTestId('grandparent');
    expect(getHostChildren(hostGrandparent)).toEqual([hostParent]);
  });

  it('returns host children for composite component', () => {
    render(
      <View testID="parent">
        <MultipleHostChildren />
        <View testID="subject" />
        <View testID="sibling" />
      </View>
    );

    expect(getHostChildren(screen.getByTestId('parent'))).toEqual([
      screen.getByTestId('child1'),
      screen.getByTestId('child2'),
      screen.getByTestId('child3'),
      screen.getByTestId('subject'),
      screen.getByTestId('sibling'),
    ]);
  });
});

describe('getHostSelves()', () => {
  it('returns passed element for host components', () => {
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="subject" />
          <View testID="sibling" />
        </View>
      </View>
    );

    const hostSubject = screen.getByTestId('subject');
    expect(getHostSelves(hostSubject)).toEqual([hostSubject]);

    const hostSibling = screen.getByTestId('sibling');
    expect(getHostSelves(hostSibling)).toEqual([hostSibling]);

    const hostParent = screen.getByTestId('parent');
    expect(getHostSelves(hostParent)).toEqual([hostParent]);

    const hostGrandparent = screen.getByTestId('grandparent');
    expect(getHostSelves(hostGrandparent)).toEqual([hostGrandparent]);
  });

  test('returns single host element for React Native composite components', () => {
    render(
      <View testID="parent">
        <Text testID="text">Text</Text>
        <TextInput
          testID="textInput"
          defaultValue="TextInputValue"
          placeholder="TextInputPlaceholder"
        />
      </View>
    );

    const compositeText = screen.getByText('Text');
    const hostText = screen.getByTestId('text');
    expect(getHostSelves(compositeText)).toEqual([hostText]);

    const compositeTextInputByValue = screen.getByDisplayValue('TextInputValue');
    const compositeTextInputByPlaceholder = screen.getByPlaceholderText('TextInputPlaceholder');

    const hostTextInput = screen.getByTestId('textInput');
    expect(getHostSelves(compositeTextInputByValue)).toEqual([hostTextInput]);
    expect(getHostSelves(compositeTextInputByPlaceholder)).toEqual([hostTextInput]);
  });

  test('returns host children for custom composite components', () => {
    render(
      <View testID="parent">
        <ZeroHostChildren />
        <MultipleHostChildren />
        <View testID="sibling" />
      </View>
    );

    const zeroCompositeComponent = screen.UNSAFE_getByType(ZeroHostChildren);
    expect(getHostSelves(zeroCompositeComponent)).toEqual([]);

    const multipleCompositeComponent = screen.UNSAFE_getByType(MultipleHostChildren);
    const hostChild1 = screen.getByTestId('child1');
    const hostChild2 = screen.getByTestId('child2');
    const hostChild3 = screen.getByTestId('child3');
    expect(getHostSelves(multipleCompositeComponent)).toEqual([hostChild1, hostChild2, hostChild3]);
  });
});

describe('getHostSiblings()', () => {
  it('returns host siblings for host component', () => {
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="siblingBefore" />
          <View testID="subject" />
          <View testID="siblingAfter" />
          <MultipleHostChildren />
        </View>
      </View>
    );

    const hostSiblings = getHostSiblings(screen.getByTestId('subject'));
    expect(hostSiblings).toEqual([
      screen.getByTestId('siblingBefore'),
      screen.getByTestId('siblingAfter'),
      screen.getByTestId('child1'),
      screen.getByTestId('child2'),
      screen.getByTestId('child3'),
    ]);
  });

  it('returns host siblings for composite component', () => {
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="siblingBefore" />
          <View testID="subject" />
          <View testID="siblingAfter" />
          <MultipleHostChildren />
        </View>
      </View>
    );

    const compositeComponent = screen.UNSAFE_getByType(MultipleHostChildren);
    const hostSiblings = getHostSiblings(compositeComponent);
    expect(hostSiblings).toEqual([
      screen.getByTestId('siblingBefore'),
      screen.getByTestId('subject'),
      screen.getByTestId('siblingAfter'),
    ]);
  });
});

describe('getUnsafeRootElement()', () => {
  it('returns UNSAFE_root for mounted view', () => {
    render(
      <View>
        <View testID="view" />
      </View>
    );

    const view = screen.getByTestId('view');
    expect(getUnsafeRootElement(view)).toEqual(screen.UNSAFE_root);
  });

  it('returns null for null', () => {
    expect(getUnsafeRootElement(null)).toEqual(null);
  });
});
