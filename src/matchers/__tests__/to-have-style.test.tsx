import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { render } from '../..';
import '../extend-expect';

test('handles positive test cases', () => {
  const styles = StyleSheet.create({
    container: { borderBottomColor: 'white' },
  });
  const { getByTestId } = render(
    <View
      testID="container"
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
    >
      <Text>Hello World</Text>
    </View>
  );

  const container = getByTestId('container');

  expect(container).toHaveStyle({ backgroundColor: 'blue', height: '100%' });
  expect(container).toHaveStyle([
    { backgroundColor: 'blue' },
    { height: '100%' },
  ]);
  expect(container).toHaveStyle({ backgroundColor: 'blue' });
  expect(container).toHaveStyle({ height: '100%' });
  expect(container).toHaveStyle({ borderBottomColor: 'white' });
  expect(container).toHaveStyle({ width: '50%' });
  expect(container).toHaveStyle([[{ width: '50%' }]]);
  expect(container).toHaveStyle({
    transform: [{ scale: 2 }, { rotate: '45deg' }],
  });
});

test('handles negative test cases', () => {
  const { getByTestId } = render(
    <View
      testID="container"
      style={{
        backgroundColor: 'blue',
        borderBottomColor: 'black',
        height: '100%',
        transform: [{ scale: 2 }, { rotate: '45deg' }],
      }}
    >
      <Text>Hello World</Text>
    </View>
  );

  const container = getByTestId('container');
  expect(() =>
    expect(container).toHaveStyle({
      backgroundColor: 'blue',
      transform: [{ scale: 1 }],
    })
  ).toThrowErrorMatchingSnapshot();
  expect(container).not.toHaveStyle({ fontWeight: 'bold' });
  expect(container).not.toHaveStyle({ color: 'black' });
  expect(container).not.toHaveStyle({
    transform: [{ rotate: '45deg' }, { scale: 2 }],
  });
  expect(container).not.toHaveStyle({ transform: [{ rotate: '45deg' }] });
});

test('handles when the style prop is undefined', () => {
  const { getByTestId } = render(
    <View testID="container">
      <Text>Hello World</Text>
    </View>
  );

  const container = getByTestId('container');

  expect(container).not.toHaveStyle({ fontWeight: 'bold' });
});

test('handles transform when transform undefined', () => {
  const { getByTestId } = render(
    <View
      testID="container"
      style={{
        backgroundColor: 'blue',
        transform: undefined,
      }}
    >
      <Text>Hello World</Text>
    </View>
  );

  const container = getByTestId('container');
  expect(() =>
    expect(container).toHaveStyle({ transform: [{ scale: 1 }] })
  ).toThrowErrorMatchingSnapshot();
});

test('handles Pressable with function style prop', () => {
  const { getByTestId } = render(
    <Pressable testID="test" style={() => ({ backgroundColor: 'blue' })} />
  );
  expect(getByTestId('test')).toHaveStyle({ backgroundColor: 'blue' });
});
