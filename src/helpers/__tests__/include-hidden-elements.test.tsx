import React from 'react';
import { View } from 'react-native';

import { configure, render, screen } from '../..';

test('includeHiddenElements query option takes priority over hidden option and global config', async () => {
  configure({ defaultHidden: true, defaultIncludeHiddenElements: true });
  await render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.queryByTestId('view', { includeHiddenElements: false, hidden: true })).toBeFalsy();
});

test('hidden option takes priority over global config when includeHiddenElements is not defined', async () => {
  configure({ defaultHidden: true, defaultIncludeHiddenElements: true });
  await render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.queryByTestId('view', { hidden: false })).toBeFalsy();
});

test('global config defaultIncludeElements option takes priority over defaultHidden when set at the same time', async () => {
  configure({ defaultHidden: false, defaultIncludeHiddenElements: true });
  await render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.getByTestId('view')).toBeTruthy();
});

test('defaultHidden takes priority when it was set last', async () => {
  // also simulates the case when defaultIncludeHiddenElements is true by default in the config
  configure({ defaultIncludeHiddenElements: true });
  configure({ defaultHidden: false });
  await render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.queryByTestId('view')).toBeFalsy();
});

test('defaultIncludeHiddenElements takes priority when it was set last', async () => {
  // also simulates the case when defaultHidden is true by default in the config
  configure({ defaultHidden: true });
  configure({ defaultIncludeHiddenElements: false });
  await render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.queryByTestId('view')).toBeFalsy();
});
