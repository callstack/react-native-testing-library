import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { dispatchHostEvent, wait } from '../utils';

export async function type(
  this: UserEventInstance,
  element: ReactTestInstance,
  text: string
) {
  // TODO provide real implementation
  await wait(this.config);
  dispatchHostEvent(element, 'changeText', text);
}
