import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import { FlatList, Text, View } from 'react-native';

import { render, screen } from '../../..';
import type { EventEntry } from '../../../test-utils/events';
import { createEventLogger } from '../../../test-utils/events';
import { userEvent } from '../..';

const data = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];

function mapEventsToShortForm(events: EventEntry[]) {
  return events.map((e) => [
    e.name,
    e.payload.nativeEvent.contentOffset.y,
    e.payload.nativeEvent.contentOffset.x,
  ]);
}

async function renderFlatListWithToolkit(props: ScrollViewProps = {}) {
  const { events, logEvent } = createEventLogger();

  const renderItem = (title: string) => <Text>{title}</Text>;
  await render(
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
    />,
  );

  return { events };
}

describe('scrollTo() with FlatList', () => {
  it('supports vertical drag scroll', async () => {
    const { events } = await renderFlatListWithToolkit();
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
    const { events } = await renderFlatListWithToolkit({ horizontal: true });
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('flatList'), { x: 100 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 0, 25],
      ['scroll', 0, 50],
      ['scroll', 0, 75],
      ['scrollEndDrag', 0, 100],
    ]);
  });
});

const DATA = new Array(100).fill(0).map((_, i) => `Item ${i}`);

function Scrollable() {
  return (
    <View style={{ flex: 1 }}>
      <FlatList
        testID="flat-list"
        data={DATA}
        renderItem={(x) => <Item title={x.item} />}
        initialNumToRender={10}
        updateCellsBatchingPeriod={0}
      />
    </View>
  );
}

function Item({ title }: { title: string }) {
  return (
    <View>
      <Text>{title}</Text>
    </View>
  );
}

test('scrollTo with contentSize and layoutMeasurement update FlatList content', async () => {
  await render(<Scrollable />);
  const user = userEvent.setup();

  expect(screen.getByText('Item 0')).toBeOnTheScreen();
  expect(screen.getByText('Item 7')).toBeOnTheScreen();
  expect(screen.queryByText('Item 15')).not.toBeOnTheScreen();

  await user.scrollTo(screen.getByTestId('flat-list'), {
    y: 300,
    contentSize: { width: 240, height: 480 },
    layoutMeasurement: { width: 240, height: 480 },
  });

  expect(screen.getByText('Item 0')).toBeOnTheScreen();
  expect(screen.getByText('Item 7')).toBeOnTheScreen();
  expect(screen.getByText('Item 15')).toBeOnTheScreen();

  // Prevent act warning by unmounting the component
  await screen.unmount();
});
