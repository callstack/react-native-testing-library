/// <reference path="./extend-expect.d.ts" />

import { toBeOnTheScreen } from './to-be-on-the-screen';
import { toBeChecked } from './to-be-checked';
import { toBeDisabled, toBeEnabled } from './to-be-disabled';
import { toBeEmptyElement } from './to-be-empty-element';
import { toBePartiallyChecked } from './to-be-partially-checked';
import { toBeVisible } from './to-be-visible';
import { toHaveDisplayValue } from './to-have-display-value';
import { toHaveProp } from './to-have-prop';
import { toHaveTextContent } from './to-have-text-content';
import { toBeSelected } from './to-be-selected';

expect.extend({
  toBeOnTheScreen,
  toBeChecked,
  toBeDisabled,
  toBeEmptyElement,
  toBeEnabled,
  toBePartiallyChecked,
  toBeVisible,
  toHaveDisplayValue,
  toHaveProp,
  toHaveTextContent,
  toBeSelected,
});
