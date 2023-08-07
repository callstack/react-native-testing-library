import * as React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  SectionList,
  StatusBar,
} from 'react-native';
import { buildEventLogger } from '../utils/helpers';

const DATA = [
  {
    title: 'Main dishes',
    data: [
      'Pizza',
      'Burger',
      'Risotto',
      'Pasta',
      'Fish',
      'Chicken',
      'Beef',
      'Dumplings',
    ],
  },
  {
    title: 'Sides',
    data: [
      'French Fries',
      'Onion Rings',
      'Fried Shrimps',
      'Potatoes',
      'Salad',
      'Garlic Bread',
    ],
  },
  {
    title: 'Drinks',
    data: ['Water', 'Coke', 'Beer', 'Tea', 'Coffee', 'Soda', 'Matcha'],
  },
  {
    title: 'Desserts',
    data: ['Cheese Cake', 'Ice Cream', 'Chocolate', 'Cookies', 'Fruits'],
  },
];

const handleOnMomentumScrollBegin = buildEventLogger('onMomentumScrollBegin');
const handleOnMomentumScrollEnd = buildEventLogger('onMomentumScrollEnd');
const handleOnScroll = buildEventLogger('onScroll');
const handleOnScrollBeginDrag = buildEventLogger('onScrollBeginDrag');
const handleOnScrollEndDrag = buildEventLogger('onScrollEndDrag');
const handleOnScrollToTop = buildEventLogger('onScrollToTop');

export function SectionListEvents() {
  const handleOnContentSizeChange = (w: number, h: number) => {
    console.log(`Event: contentSizeChange`, w, h);
  };

  const handleOnEndReached = (info: { distanceFromEnd: number }) => {
    console.log(`Event: endReached`, info.distanceFromEnd);
  };

  return (
    <SafeAreaView style={styles.container}>
      <SectionList
        sections={DATA}
        keyExtractor={(item, index) => item + index}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text style={styles.title}>{item}</Text>
          </View>
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Text style={styles.header}>{title}</Text>
        )}
        onContentSizeChange={handleOnContentSizeChange}
        onMomentumScrollBegin={handleOnMomentumScrollBegin}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        onScroll={handleOnScroll}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        onScrollEndDrag={handleOnScrollEndDrag}
        onScrollToTop={handleOnScrollToTop}
        onEndReached={handleOnEndReached}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
    marginHorizontal: 16,
  },
  item: {
    backgroundColor: 'pink',
    padding: 20,
    marginVertical: 8,
  },
  header: {
    fontSize: 32,
  },
  title: {
    fontSize: 24,
  },
});
