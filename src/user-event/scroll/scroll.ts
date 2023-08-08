import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { dispatchEvent } from '../utils';
import { ContentOffset } from '../event-builder/scroll';

export interface ScrollOptions {
  offset: ContentOffset;
}

export async function scroll(
  this: UserEventInstance,
  element: ReactTestInstance,
  options: ScrollOptions
): Promise<void> {
  await emitScrollEvents(element, options.offset);
}

async function emitScrollEvents(
  element: ReactTestInstance,
  offset: ContentOffset
) {
  dispatchEvent(element, 'scrollBeginDrag', EventBuilder.Scroll.scroll());
  dispatchEvent(element, 'scroll', EventBuilder.Scroll.scroll(offset));
  dispatchEvent(element, 'scrollEndDrag', EventBuilder.Scroll.scroll(offset));
}
