// @flow
/* eslint-disable react-native/no-color-literals */
import React from 'react';
import { StyleSheet, View, Button, Text } from 'react-native';
import { render } from '..';
import '@testing-library/jest-native/extend-expect';

const style = StyleSheet.create({
  style1: {
    color: 'red',
    backgroundColor: 'green',
  },
});

test('jest-native matchers work correctly', () => {
  const { getByText, getByA11yHint } = render(
    <View>
      <Button title="Enabled Button" onPress={jest.fn()} />
      <Button title="Disabled Button" disabled={true} onPress={jest.fn()} />
      <Text accessibilityHint="Empty Text" style={style.style1} />
      <Text accessibilityHint="Not Empty Text">Not empty</Text>
      <View accessibilityHint="Empty View" />
      <View accessibilityHint="Not Empty View">
        <Text />
      </View>
      <View accessibilityHint="Container View">
        <View accessibilityHint="First-Level Child">
          <Text>Second-Level Child</Text>
        </View>
      </View>
    </View>
  );

  expect(getByText('Enabled Button')).toBeEnabled();
  expect(getByText('Disabled Button')).not.toBeEnabled();

  expect(getByText('Disabled Button')).toBeDisabled();
  expect(getByText('Enabled Button')).not.toBeDisabled();

  expect(getByA11yHint('Empty Text')).toBeEmpty();
  expect(getByA11yHint('Empty View')).toBeEmpty();
  expect(getByA11yHint('Not Empty Text')).not.toBeEmpty();
  expect(getByA11yHint('Not Empty View')).not.toBeEmpty();

  expect(getByA11yHint('Container View')).toContainElement(
    getByA11yHint('First-Level Child')
  );
  expect(getByA11yHint('Container View')).toContainElement(
    getByText('Second-Level Child')
  );
  expect(getByA11yHint('Container View')).not.toContainElement(
    getByText('Enabled Button')
  );

  expect(getByA11yHint('Not Empty Text')).toHaveTextContent('Not empty');
  expect(getByA11yHint('Not Empty Text')).toHaveTextContent(/Not empty/);
  expect(getByA11yHint('Not Empty Text')).not.toHaveTextContent('Is empty');

  expect(getByA11yHint('Empty Text')).toHaveStyle({ color: 'red' });
  expect(getByA11yHint('Empty Text')).toHaveStyle({
    color: 'red',
    backgroundColor: 'green',
  });
  expect(getByA11yHint('Empty Text')).not.toHaveStyle({ color: 'green' });
  expect(getByA11yHint('Empty Text')).not.toHaveStyle({
    color: 'green',
    backgroundColor: 'green',
  });
});

test.skip('currently failing jest-native matchers tests', () => {
  const { getByText, getByA11yHint } = render(
    <View>
      <Button title="Enabled Button" onPress={jest.fn()} />
      <Button title="Disabled Button" disabled={true} onPress={jest.fn()} />
      <Text accessibilityHint="Empty Text" style={style.style1} />
      <Text accessibilityHint="Not Empty Text">Not empty</Text>
      <View accessibilityHint="Empty View" />
      <View accessibilityHint="Not Empty View">
        <Text />
      </View>
      <View accessibilityHint="Container View">
        <View accessibilityHint="First-Level Child">
          <Text>Second-Level Child</Text>
        </View>
      </View>
    </View>
  );

  expect(getByText('Enabled Button')).toHaveProp('title');
  expect(getByText('Enabled Button')).toHaveProp('title', 'Enabled Button');
  expect(getByText('Enabled Button')).not.toHaveProp('title', 'Button');
  expect(getByA11yHint('Not Empty Text')).toHaveProp('text', 'Not empty');
});
