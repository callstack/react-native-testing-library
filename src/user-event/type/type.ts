import { ReactTestInstance } from 'react-test-renderer';
import { UserEventInstance } from '../setup';
import { dispatchHostEvent, wait } from '../utils';

export async function type(
  this: UserEventInstance,
  element: ReactTestInstance,
  text: string
) {
  await wait(this.config);
  dispatchHostEvent(element, 'changeText', text);
}
