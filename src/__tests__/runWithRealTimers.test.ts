import { setImmediate, setTimeout } from '../helpers/timers';

describe('runWithRealTimers', () => {
  test('real setImmediate is called when timers are fake', async () => {
    jest.useFakeTimers({ legacyFakeTimers: false });
    const timeout = new Promise((_, reject) => setTimeout(reject, 1000))
    const immediate = new Promise(resolve => setImmediate(resolve))
    const result = await Promise.race([timeout, immediate])
      .then(() => 'resolve')
      .catch(() => 'reject')
    expect(result).toEqual('resolve')
  });
});
