import { ReactTestInstance } from 'react-test-renderer';
import { EventBuilder } from '../event-builder';
import { UserEventInstance } from '../setup';
import { dispatchHostEvent, wait } from '../utils';

export async function press(
  this: UserEventInstance,
  element: ReactTestInstance
) {
  // TODO provide real implementation
  dispatchHostEvent(element, 'pressIn', EventBuilder.Common.touch());

  await wait(this.config);
  dispatchHostEvent(element, 'press', EventBuilder.Common.touch());
  dispatchHostEvent(element, 'pressOut', EventBuilder.Common.touch());
}
