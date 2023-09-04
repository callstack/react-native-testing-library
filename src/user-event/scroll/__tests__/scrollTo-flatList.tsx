import * as React from 'react';
import { FlatList, ScrollViewProps, Text } from 'react-native';
import { EventEntry, createEventLogger } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';

const data = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function mapEventsToShortForm(events: EventEntry[]) {
  return events.map((e) => [
    e.name,
    e.payload.nativeEvent.contentOffset.y,
    e.payload.nativeEvent.contentOffset.x,
  ]);
}

function renderFlatListWithToolkit(props: ScrollViewProps = {}) {
  const { events, logEvent } = createEventLogger();

  const renderItem = (title: string) => <Text>{title}</Text>;
  render(
    <FlatList
      testID="flatList"
      onScroll={logEvent('scroll')}
      onScrollBeginDrag={logEvent('scrollBeginDrag')}
      onScrollEndDrag={logEvent('scrollEndDrag')}
      onMomentumScrollBegin={logEvent('momentumScrollBegin')}
      onMomentumScrollEnd={logEvent('momentumScrollEnd')}
      onScrollToTop={logEvent('scrollToTop')}
      onEndReached={logEvent('endReached')}
      onViewableItemsChanged={logEvent('viewableItemsChanged')}
      data={data}
      renderItem={({ item }) => renderItem(item)}
      {...props}
    />
  );

  return { events };
}

describe('scrollTo() with FlatList', () => {
  it('supports vertical drag scroll', async () => {
    const { events } = renderFlatListWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('flatList'), { y: 100 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 25, 0],
      ['scroll', 50, 0],
      ['scroll', 75, 0],
      ['scrollEndDrag', 100, 0],
    ]);
    expect(events).toMatchSnapshot('scrollTo({ y: 100 })');
  });

  it('supports horizontal drag scroll', async () => {
    const { events } = renderFlatListWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('flatList'), { x: 100 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 0, 25],
      ['scroll', 0, 50],
      ['scroll', 0, 75],
      ['scrollEndDrag', 0, 100],
    ]);
    expect(events).toMatchSnapshot('scrollTo({ x: 100 })');
  });
});
