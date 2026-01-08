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
