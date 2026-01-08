import { waitForElementToBeRemoved } from '..';

it('throws error when element is already removed at the time of calling', async () => {
  await expect(waitForElementToBeRemoved(() => null)).rejects.toThrow(
    'The element(s) given to waitForElementToBeRemoved are already removed. waitForElementToBeRemoved requires that the element(s) exist(s) before waiting for removal.',
  );
});
