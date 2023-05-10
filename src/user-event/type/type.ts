import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { dispatchHostEvent, wait } from '../utils';
import { EventBuilder } from '../event-builder';

export async function type(
  this: UserEventInstance,
  element: ReactTestInstance,
  text: string
) {
  // TODO provide real implementation
  await wait(this.config);
  dispatchHostEvent(element, 'focus', EventBuilder.Common.focus());

  await wait(this.config);
  dispatchHostEvent(element, 'changeText', text);

  await wait(this.config);
  dispatchHostEvent(element, 'blur', EventBuilder.Common.blur());
}
