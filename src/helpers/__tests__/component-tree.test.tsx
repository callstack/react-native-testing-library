import React from 'react';
import { Text, TextInput, View } from 'react-native';

import { render, screen } from '../..';
import {
  getHostChildren,
  getHostParent,
  getHostSelves,
  getHostSiblings,
  getContainerElement,
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

describe('getHostChildren()', () => {
  it('returns host children for host component', () => {
    render(
      <View testID="grandparent">
        <View testID="parent">
          <View testID="subject" />
          <Text testID="sibling">Hello</Text>
        </View>
      </View>,
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
      </View>,
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
      </View>,
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
      </View>,
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
      </View>,
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
});

describe('getContainerElement()', () => {
  it('returns container for mounted view', () => {
    render(
      <View>
        <View testID="view" />
      </View>,
    );

    const view = screen.getByTestId('view');
    expect(getContainerElement(view)).toEqual(screen.container);
  });
});
