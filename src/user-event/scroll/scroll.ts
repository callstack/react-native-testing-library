import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { EventBuilder } from '../event-builder';
import { dispatchEvent } from '../utils';

export async function scroll(
  this: UserEventInstance,
  element: ReactTestInstance
): Promise<void> {
  await emitScrollEvents(element);
}

async function emitScrollEvents(element: ReactTestInstance) {
  dispatchEvent(element, 'scrollBeginDrag', EventBuilder.Scroll.scroll());
  dispatchEvent(element, 'scroll', EventBuilder.Scroll.scroll({ x: 0, y: 90 }));
  dispatchEvent(
    element,
    'scrollEndDrag',
    EventBuilder.Scroll.scroll({ x: 0, y: 90 })
  );
}
