import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { render, screen } from '..';

const data = ['Cheese Cake', 'Ice Cream', 'Chocolate', 'Cookies', 'Fruits'];

function renderItem({ item }: { item: string }) {
  return (
    <View>
      <Text>{item}</Text>
    </View>
  );
}

function SweetsList() {
  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={(item) => item}
    />
  );
}

// test('FlatList works in RNTL', () => {
//   render(<SweetsList />);
//   expect(screen.getByText('Cheese Cake')).toBeTruthy();
// });

test('RNTL Test', () => {
  render(
    <View>
      <View accessible testID="no-role" />
      <View accessible testID="role-none" accessibilityRole="none" />
      <View accessible testID="role-button" accessibilityRole="button" />
    </View>
  );
  screen.debug();
  expect(screen.getByRole('button')).toBeTruthy();
  expect(screen.getByRole('none')).toBeTruthy();
});
