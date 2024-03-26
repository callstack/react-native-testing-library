import * as React from 'react';
import { View } from 'react-native';
import { render, screen } from '../..';
import { clearRenderResult } from '../../screen';

test('findByTestId detects screen being detached', async () => {
  render(<View />);

  const promise = screen.findByTestId('not-exists', {}, { timeout: 50 });

  // Detach screen
  clearRenderResult();

  await expect(promise).rejects.toThrowErrorMatchingInlineSnapshot(`
    "Unable to find an element with testID: not-exists

    Screen is no longer attached. Check your test for "findBy*" or "waitFor" calls that have not been awaited."
  `);
});
