import * as React from 'react';
import { ScrollView, ScrollViewProps, View } from 'react-native';
import { EventEntry, createEventLogger } from '../../../test-utils';
import { render, screen } from '../../..';
import { userEvent } from '../..';

function mapEventsToShortForm(events: EventEntry[]) {
  return events.map((e) => [
    e.name,
    e.payload.nativeEvent.contentOffset.y,
    e.payload.nativeEvent.contentOffset.x,
  ]);
}

function renderScrollViewWithToolkit(props: ScrollViewProps = {}) {
  const { events, logEvent } = createEventLogger();

  render(
    <ScrollView
      testID="scrollView"
      onScroll={logEvent('scroll')}
      onScrollBeginDrag={logEvent('scrollBeginDrag')}
      onScrollEndDrag={logEvent('scrollEndDrag')}
      onMomentumScrollBegin={logEvent('momentumScrollBegin')}
      onMomentumScrollEnd={logEvent('momentumScrollEnd')}
      onScrollToTop={logEvent('scrollToTop')}
      {...props}
    />
  );

  return { events };
}

describe('scrollTo()', () => {
  it('supports vertical drag scroll', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), { y: 100 });
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
    const { events } = renderScrollViewWithToolkit({ horizontal: true });
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), { x: 100 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 0, 25],
      ['scroll', 0, 50],
      ['scroll', 0, 75],
      ['scrollEndDrag', 0, 100],
    ]);
    expect(events).toMatchSnapshot('scrollTo({ x: 100 })');
  });

  it('supports vertical momentum scroll', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), {
      y: 100,
      momentumY: 120,
    });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 25, 0],
      ['scroll', 50, 0],
      ['scroll', 75, 0],
      ['scrollEndDrag', 100, 0],
      ['momentumScrollBegin', 100, 0],
      ['scroll', 110, 0],
      ['scroll', 115, 0],
      ['scroll', 117.5, 0],
      ['scroll', 120, 0],
      ['momentumScrollEnd', 120, 0],
    ]);
    expect(events).toMatchSnapshot('scrollTo({ y: 100 })');
  });
});

describe('userEvent.scroll with fake timers', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.setSystemTime(0);
  });

  test('calls events', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), { y: 120 });
    expect(events).toMatchSnapshot('scrollTo({ y: 120 })');
  });

  test('calls events with momentum', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), {
      y: 120,
      momentumY: 30,
    });

    expect(events).toMatchSnapshot('scrollTo({ y: 120, momentum: 30 })');
  });

  test('scrolling the same element twice starts from remembered value (top to bottom/bottom to top)', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), { y: 120 });
    await user.scrollTo(screen.getByTestId('scrollView'), { y: 20 });

    expect(events).toMatchSnapshot(
      'scrollTo({ y: 120 }) + scrollTo({ y: 20 })'
    );
  });

  it('does NOT work on View', async () => {
    const screen = render(<View testID="view" />);
    const user = userEvent.setup();

    await expect(
      user.scrollTo(screen.getByTestId('view'), { y: 20 })
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollTo() works only with host "ScrollView" elements. Passed element has type "View"."`
    );
  });

  test('scrollTo is accessible directly in userEvent', async () => {
    const { events } = renderScrollViewWithToolkit();

    await userEvent.scrollTo(screen.getByTestId('scrollView'), { y: 100 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 25, 0],
      ['scroll', 50, 0],
      ['scroll', 75, 0],
      ['scrollEndDrag', 100, 0],
    ]);

    expect(events).toMatchSnapshot('scrollTo({ y: 100 })');
  });
});
