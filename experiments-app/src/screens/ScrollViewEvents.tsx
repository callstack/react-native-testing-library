import * as React from 'react';
import {
  StyleSheet,
  Text,
  SafeAreaView,
  ScrollView,
  StatusBar,
} from 'react-native';
import { buildEventLogger } from '../utils/helpers';

const handleOnMomentumScrollBegin = buildEventLogger('onMomentumScrollBegin');
const handleOnMomentumScrollEnd = buildEventLogger('onMomentumScrollEnd');
const handleOnScroll = buildEventLogger('onScroll');
const handleOnScrollBeginDrag = buildEventLogger('onScrollBeginDrag');
const handleOnScrollEndDrag = buildEventLogger('onScrollEndDrag');
const handleOnScrollToTop = buildEventLogger('onScrollToTop');

export function ScrollViewEvents() {
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        onMomentumScrollBegin={handleOnMomentumScrollBegin}
        onMomentumScrollEnd={handleOnMomentumScrollEnd}
        onScroll={handleOnScroll}
        onScrollBeginDrag={handleOnScrollBeginDrag}
        onScrollEndDrag={handleOnScrollEndDrag}
        onScrollToTop={handleOnScrollToTop}
      >
        <Text style={styles.text}>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: StatusBar.currentHeight,
  },
  scrollView: {
    backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  text: {
    fontSize: 42,
  },
});
