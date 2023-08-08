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
  dispatchEvent(element, 'scrollBeginDrag', EventBuilder.Scroll.scroll());

  const dividedOffset: ContentOffset = {
    x: (offset.x || 0) / steps,
    y: (offset.y || 0) / steps,
  };

  [...new Array(steps)].forEach(() => {
    dispatchEvent(element, 'scroll', EventBuilder.Scroll.scroll(dividedOffset));
  });

  dispatchEvent(element, 'scrollEndDrag', EventBuilder.Scroll.scroll(offset));
}
