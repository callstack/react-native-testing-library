import * as React from 'react';
import type { ScrollViewProps } from 'react-native';
import { ScrollView, View } from 'react-native';

import { fireEvent, render, screen } from '../../..';
import type { EventEntry } from '../../../test-utils/events';
import { createEventLogger } from '../../../test-utils/events';
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
    />,
  );

  return { events };
}

beforeEach(() => {
  jest.useRealTimers();
});

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
  });

  test('works with fake timers', async () => {
    jest.useFakeTimers();
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
  });

  test('remembers previous scroll offset', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), { y: 100 });
    await user.scrollTo(screen.getByTestId('scrollView'), { y: 200 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 25, 0],
      ['scroll', 50, 0],
      ['scroll', 75, 0],
      ['scrollEndDrag', 100, 0],
      ['scrollBeginDrag', 100, 0],
      ['scroll', 125, 0],
      ['scroll', 150, 0],
      ['scroll', 175, 0],
      ['scrollEndDrag', 200, 0],
    ]);
  });

  test('remembers previous scroll offset from "fireEvent.scroll"', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await fireEvent.scroll(screen.getByTestId('scrollView'), {
      nativeEvent: { contentOffset: { y: 100 } },
    });
    await user.scrollTo(screen.getByTestId('scrollView'), { y: 200 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scroll', 100, undefined],
      ['scrollBeginDrag', 100, 0],
      ['scroll', 125, 0],
      ['scroll', 150, 0],
      ['scroll', 175, 0],
      ['scrollEndDrag', 200, 0],
    ]);
  });

  it('validates vertical scroll direction', async () => {
    renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await expect(() =>
      user.scrollTo(screen.getByTestId('scrollView'), { x: 100 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollTo() expected only vertical scroll options: "y" and "momentumY" for vertical "ScrollView" element but received {"x": 100}"`,
    );
  });

  it('validates horizontal scroll direction', async () => {
    renderScrollViewWithToolkit({ horizontal: true });
    const user = userEvent.setup();

    await expect(() =>
      user.scrollTo(screen.getByTestId('scrollView'), { y: 100 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollTo() expected only horizontal scroll options: "x" and "momentumX" for horizontal "ScrollView" element but received {"y": 100}"`,
    );
  });

  it('generates single drag step if already at target offset', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), { y: 0 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scrollEndDrag', 0, 0],
    ]);
  });

  it('generates single momentum step if already at target offset', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    await user.scrollTo(screen.getByTestId('scrollView'), {
      y: 100,
      momentumY: 100,
    });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 25, 0],
      ['scroll', 50, 0],
      ['scroll', 75, 0],
      ['scrollEndDrag', 100, 0],
      ['momentumScrollBegin', 100, 0],
      ['scroll', 100, 0],
      ['momentumScrollEnd', 100, 0],
    ]);
  });

  it('generates no steps for scroll without offset', async () => {
    const { events } = renderScrollViewWithToolkit();
    const user = userEvent.setup();

    // @ts-expect-error intentionally omitting required options
    await user.scrollTo(screen.getByTestId('scrollView'), {});
    expect(mapEventsToShortForm(events)).toEqual([]);
  });

  it('does NOT work on View', async () => {
    render(<View testID="view" />);
    const user = userEvent.setup();

    await expect(
      user.scrollTo(screen.getByTestId('view'), { y: 20 }),
    ).rejects.toThrowErrorMatchingInlineSnapshot(
      `"scrollTo() works only with host "ScrollView" elements. Passed element has type "View"."`,
    );
  });

  test('is accessible directly in userEvent', async () => {
    const { events } = renderScrollViewWithToolkit();

    await userEvent.scrollTo(screen.getByTestId('scrollView'), { y: 100 });
    expect(mapEventsToShortForm(events)).toEqual([
      ['scrollBeginDrag', 0, 0],
      ['scroll', 25, 0],
      ['scroll', 50, 0],
      ['scroll', 75, 0],
      ['scrollEndDrag', 100, 0],
    ]);
  });
});
