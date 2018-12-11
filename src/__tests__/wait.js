// @flow
import { wait } from '..';

test('it waits for the data to be loaded', async () => {
  const spy = jest.fn();
  const randomTimeout = Math.floor(Math.random() * 60);
  setTimeout(spy, randomTimeout);

  await wait(() => expect(spy).toHaveBeenCalledTimes(1));
  expect(spy).toHaveBeenCalledWith();
});

test('can just be used for a next tick', async () => {
  const spy = jest.fn();
  Promise.resolve().then(spy);
  expect(spy).toHaveBeenCalledTimes(0);
  await wait();
  expect(spy).toHaveBeenCalledTimes(1);
  jest.clearAllTimers();
});
