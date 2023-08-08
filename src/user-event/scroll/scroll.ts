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
  dispatchEvent(element, 'scrollBeginDrag', EventBuilder.Common.touch());
  dispatchEvent(element, 'scroll', EventBuilder.Common.touch());
  dispatchEvent(element, 'scrollEndDrag', EventBuilder.Common.touch());
}
