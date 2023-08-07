import * as React from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import { buildEventLogger } from '../utils/helpers';

interface SectionData {
  title: string;
  data: string[];
}

const sections: SectionData[] = [
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

const handleMomentumScrollBegin = buildEventLogger('momentumScrollBegin');
const handleMomentumScrollEnd = buildEventLogger('momentumScrollEnd');
const handleScroll = buildEventLogger('scroll');
const handleScrollBeginDrag = buildEventLogger('scrollBeginDrag');
const handleScrollEndDrag = buildEventLogger('scrollEndDrag');
const handleScrollToTop = buildEventLogger('scrollToTop');

export function SectionListEvents() {
  const handleContentSizeChange = (w: number, h: number) => {
    console.log(`Event: contentSizeChange`, w, h);
  };

  const handleEndReached = (info: { distanceFromEnd: number }) => {
    console.log(`Event: endReached`, info);
  };

  const renderSectionHeader = ({ section }: { section: SectionData }) => (
    <Text style={styles.header}>{section.title}</Text>
  );

  const renderItem = ({ item }: { item: string }) => (
    <View style={styles.item}>
      <Text style={styles.title}>{item}</Text>
    </View>
  );

  return (
    <SectionList
      contentInsetAdjustmentBehavior="scrollableAxes"
      scrollEventThrottle={150}
      sections={sections}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      onContentSizeChange={handleContentSizeChange}
      onMomentumScrollBegin={handleMomentumScrollBegin}
      onMomentumScrollEnd={handleMomentumScrollEnd}
      onScroll={handleScroll}
      onScrollBeginDrag={handleScrollBeginDrag}
      onScrollEndDrag={handleScrollEndDrag}
      onScrollToTop={handleScrollToTop}
      onEndReached={handleEndReached}
    />
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    fontSize: 24,
  },
  item: {
    paddingVertical: 16,
    paddingHorizontal: 16,
  },

  title: {
    fontSize: 20,
  },
});
