import { View } from 'react-native';
import React from 'react';

import render from '../../render';
import { screen } from '../../screen';
import { configure } from '../../config';

test('includeHiddenElements query option takes priority over hidden option and global config', () => {
  configure({ defaultHidden: true, defaultIncludeHiddenElements: true });
  render(<View testID="view" style={{ display: 'none' }} />);
  expect(
    screen.queryByTestId('view', { includeHiddenElements: false, hidden: true })
  ).toBeFalsy();
});

test('hidden option takes priority over global config when includeHiddenElements is not defined', () => {
  configure({ defaultHidden: true, defaultIncludeHiddenElements: true });
  render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.queryByTestId('view', { hidden: false })).toBeFalsy();
});

test('global config defaultIncludeElements option takes priority over defaultHidden when set at the same time', () => {
  configure({ defaultHidden: false, defaultIncludeHiddenElements: true });
  render(<View testID="view" style={{ display: 'none' }} />);
  expect(screen.getByTestId('view')).toBeTruthy();
});
