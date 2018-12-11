// @flow
import waitForExpect from './waitForElement';

export default function wait(
  expectation: () => Promise<{}> = () => Promise.resolve({}),
  timeout: number = 4500,
  interval: number = 50
): Promise<{}> {
  return waitForExpect(expectation, timeout, interval);
}
