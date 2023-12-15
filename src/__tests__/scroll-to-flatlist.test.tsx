import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { render, screen, userEvent } from '..';

const DATA = new Array(100).fill(0).map((_, i) => `Item ${i}`);

function Item({ title }: { title: string }) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

function Scrollable() {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        testID="test-flatlist"
        data={DATA}
        renderItem={(x) => <Item title={x.item} />}
        initialNumToRender={10}
        updateCellsBatchingPeriod={0}
      />
    </View>
  );
}

test('scrollTo with contentSize and layoutMeasurement causes FlatList to update its content', async () => {
  render(<Scrollable />);

  const flatlist = screen.getByTestId('test-flatlist');

  const item1 = screen.queryByText('Item 0');
  const item2 = screen.queryByText('Item 7');

  const user = userEvent.setup();
  await user.scrollTo(flatlist, {
    y: 300,
    contentSize: { width: 240, height: 480 },
    layoutMeasurement: { width: 240, height: 480 },
  });

  const item3 = screen.queryByText('Item 15');

  expect(item1).not.toBeNull();
  expect(item2).not.toBeNull();
  expect(item3).not.toBeNull();
});

test('scrollTo without contentSize and layoutMeasurement does not cause FlatList to update its content', async () => {
  render(<Scrollable />);

  const flatlist = screen.getByTestId('test-flatlist');

  const item1 = screen.queryByText('Item 0');
  const item2 = screen.queryByText('Item 7');

  const user = userEvent.setup();
  await user.scrollTo(flatlist, { y: 300 });

  const item3 = screen.queryByText('Item 15');

  expect(item1).not.toBeNull();
  expect(item2).not.toBeNull();
  expect(item3).toBeNull();
});
