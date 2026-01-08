import { waitFor } from '..';

it('throws timeout error when expectation never passes within timeout period', async () => {
  const startTime = Date.now();
  const timeout = 100;

  await expect(
    waitFor(
      () => {
        throw new Error('Condition not met');
      },
      { timeout },
    ),
  ).rejects.toThrow('Condition not met');

  const elapsed = Date.now() - startTime;
  expect(elapsed).toBeGreaterThanOrEqual(timeout);
  expect(elapsed).toBeLessThan(timeout + 50); // Allow small margin for test execution
});

it('resolves when expectation returns a promise that resolves', async () => {
  let attemptCount = 0;
  const result = await waitFor(() => {
    attemptCount++;
    if (attemptCount < 3) {
      return Promise.reject(new Error('not ready yet'));
    }
    return Promise.resolve('success');
  });

  expect(result).toBe('success');
  expect(attemptCount).toBeGreaterThanOrEqual(3);
});

it('calls onTimeout callback with error and uses returned error when provided', async () => {
  const customError = new Error('Custom timeout message');
  const onTimeout = jest.fn((_error: Error) => customError);

  await expect(
    waitFor(
      () => {
        throw new Error('Condition not met');
      },
      { timeout: 100, onTimeout },
    ),
  ).rejects.toThrow('Custom timeout message');

  expect(onTimeout).toHaveBeenCalledTimes(1);
  expect(onTimeout).toHaveBeenCalledWith(expect.any(Error));
});
