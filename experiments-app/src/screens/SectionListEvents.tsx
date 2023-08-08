import * as React from 'react';
import { StyleSheet, Text, View, SectionList } from 'react-native';
import { customEventLogger, nativeEventLogger } from '../utils/helpers';

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

export function SectionListEvents() {
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
      sections={sections}
      keyExtractor={(item, index) => item + index}
      renderSectionHeader={renderSectionHeader}
      renderItem={renderItem}
      contentInsetAdjustmentBehavior="scrollableAxes"
      scrollEventThrottle={150}
      onScroll={nativeEventLogger('scroll')}
      onScrollBeginDrag={nativeEventLogger('scrollBeginDrag')}
      onScrollEndDrag={nativeEventLogger('scrollEndDrag')}
      onMomentumScrollBegin={nativeEventLogger('momentumScrollBegin')}
      onMomentumScrollEnd={nativeEventLogger('momentumScrollEnd')}
      onScrollToTop={nativeEventLogger('scrollToTop')}
      onEndReached={customEventLogger('endReached')}
      onContentSizeChange={customEventLogger('contentSizeChange')}
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
