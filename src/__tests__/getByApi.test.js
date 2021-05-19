// @flow
import React from 'react';
import { View, Text, TextInput, Button } from 'react-native';
import { render, getDefaultNormalizer } from '..';

describe('Supports a TextMatch options', () => {
  test('getByText, getAllByText', () => {
    const { getByText, getAllByText } = render(
      <View>
        <Text testID="text">Text and details</Text>
        <Button
          testID="button"
          title="Button and a detail"
          onPress={jest.fn()}
        />
      </View>
    );

    expect(getByText('details', { exact: false })).toBeTruthy();
    expect(getAllByText('detail', { exact: false })).toHaveLength(2);
  });

  test('getByPlaceholderText, getAllByPlaceholderText', () => {
    const { getByPlaceholderText, getAllByPlaceholderText } = render(
      <View>
        <TextInput placeholder={'Placeholder with details'} />
        <TextInput placeholder={'Placeholder with a DETAIL'} />
      </View>
    );

    expect(getByPlaceholderText('details', { exact: false })).toBeTruthy();
    expect(getAllByPlaceholderText('detail', { exact: false })).toHaveLength(2);
  });

  test('getByDisplayValue, getAllByDisplayValue', () => {
    const { getByDisplayValue, getAllByDisplayValue } = render(
      <View>
        <TextInput value={'Value with details'} />
        <TextInput value={'Value with a detail'} />
      </View>
    );

    expect(getByDisplayValue('details', { exact: false })).toBeTruthy();
    expect(getAllByDisplayValue('detail', { exact: false })).toHaveLength(2);
  });

  test('getByTestId, getAllByTestId', () => {
    const { getByTestId, getAllByTestId } = render(
      <View>
        <View testID="test" />
        <View testID="tests id" />
      </View>
    );
    expect(getByTestId('id', { exact: false })).toBeTruthy();
    expect(getAllByTestId('test', { exact: false })).toHaveLength(2);
  });

  test('with TextMatch option exact === false text search is NOT case sensitive', () => {
    const { getByText, getAllByText } = render(
      <View>
        <Text testID="text">Text and details</Text>
        <Button
          testID="button"
          title="Button and a DeTAil"
          onPress={jest.fn()}
        />
      </View>
    );

    expect(getByText('DeTaIlS', { exact: false })).toBeTruthy();
    expect(getAllByText('detail', { exact: false })).toHaveLength(2);
  });
});

describe('Supports normalization', () => {
  test('trims and collapses whitespace by default', () => {
    const { getByText } = render(
      <View>
        <Text>{`  Text     and


        whitespace`}</Text>
      </View>
    );

    expect(getByText('Text and whitespace')).toBeTruthy();
  });

  test('trim and collapseWhitespace is customizable by getDefaultNormalizer param', () => {
    const testTextWithWhitespace = `  Text     and


        whitespace`;
    const { getByText } = render(
      <View>
        <Text>{testTextWithWhitespace}</Text>
      </View>
    );

    expect(
      getByText(testTextWithWhitespace, {
        normalizer: getDefaultNormalizer({
          trim: false,
          collapseWhitespace: false,
        }),
      })
    ).toBeTruthy();
  });

  test('normalizer function is customisable', () => {
    const testText = 'A TO REMOVE text';
    const normalizerFn = (textToNormalize: string) =>
      textToNormalize.replace('TO REMOVE ', '');
    const { getByText } = render(
      <View>
        <Text>{testText}</Text>
      </View>
    );

    expect(
      getByText('A text', {
        normalizer: normalizerFn,
      })
    ).toBeTruthy();
  });
});
