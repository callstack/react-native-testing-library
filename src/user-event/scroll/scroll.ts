import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { dispatchEvent } from '../utils';
import { ContentOffset } from '../event-builder/scroll';

export interface ScrollOptions {
  offset: ContentOffset;
  steps?: number;
}

export async function scroll(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: ScrollOptions
): Promise<void> {
  await emitScrollEvents(element, options.offset, options.steps);
}

async function emitScrollEvents(
  element: ReactTestInstance,
  offset: ContentOffset,
  steps: number = 3
) {
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

  dispatchEvent(element, 'scrollEndDrag', EventBuilder.Scroll.scroll(offset));
}
