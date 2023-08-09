import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { dispatchEvent } from '../utils';
import { ContentOffset } from '../event-builder/scroll';

export interface ScrollOptions {
  offset: ContentOffset;
  steps?: number;
  momentumScroll?: MomentumScroll;
}

export interface MomentumScroll {
  value: number;
  steps?: number;
}

export async function scroll(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: ScrollOptions
): Promise<void> {
  await emitScrollEvents(element, options.offset, options.steps);

  if (options.momentumScroll) {
    await emitMomentumEvents(
      element,
      options.offset,
      options.momentumScroll.value,
      options.momentumScroll.steps || 0
    );
  }
}

export async function scrollToTop(element: ReactTestInstance): Promise<void> {
  dispatchEvent(
    element,
    'scrollToTop',
    EventBuilder.Scroll.scroll({
      x: 0,
      y: 0,
    })
  );
}

async function emitScrollEvents(
  element: ReactTestInstance,
  offset: ContentOffset,
  steps: number = 3
): Promise<void> {
  let x = 0;
  let y = 0;

  dispatchEvent(
    element,
    'scrollBeginDrag',
    EventBuilder.Scroll.scroll({
      x: x,
      y: y,
    })
  );

  await emitIntermediateEvents(element, x, y, offset, steps);

  dispatchEvent(element, 'scrollEndDrag', EventBuilder.Scroll.scroll(offset));
}

async function emitMomentumEvents(
  element: ReactTestInstance,
  offset: ContentOffset,
  value: number,
  steps: number
): Promise<void> {
  let x = offset.x || 0;
  let y = offset.y || 0;

  const momentumOffset: ContentOffset = {
    x: offset.x ? value : 0,
    y: offset.y ? value : 0,
  };

  const targetOffset: ContentOffset = {
    x: offset.x ? offset.x + value : 0,
    y: offset.y ? offset.y + value : 0,
  };

  dispatchEvent(
    element,
    'momentumScrollBegin',
    EventBuilder.Scroll.scroll(offset)
  );

  await emitIntermediateEvents(element, x, y, momentumOffset, steps);

  dispatchEvent(
    element,
    'momentumScrollEnd',
    EventBuilder.Scroll.scroll(targetOffset)
  );
}

async function emitIntermediateEvents(
  element: ReactTestInstance,
  x: number,
  y: number,
  offset: ContentOffset,
  steps: number
): Promise<void> {
  const offsetStepX = (offset.x || 0) / (steps + 1);
  const offsetStepY = (offset.y || 0) / (steps + 1);

  [...new Array(steps)].forEach(() => {
    x = x + offsetStepX;
    y = y + offsetStepY;
    dispatchEvent(
      element,
      'scroll',
      EventBuilder.Scroll.scroll({
        x: x,
        y: y,
      })
    );
  });
}
