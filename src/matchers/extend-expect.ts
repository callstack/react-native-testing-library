/// <reference path="./extend-expect.d.ts" />

import { toBeOnTheScreen } from './to-be-on-the-screen';
import { toBeDisabled, toBeEnabled } from './to-be-disabled';
import { toBeEmptyElement } from './to-be-empty-element';
import { toBeVisible } from './to-be-visible';
import { toHaveDisplayValue } from './to-have-display-value';
import { toHaveProp } from './to-have-prop';
import { toHaveTextContent } from './to-have-text-content';

expect.extend({
  toBeOnTheScreen,
  toBeDisabled,
  toBeEmptyElement,
  toBeEnabled,
  toBeVisible,
  toHaveDisplayValue,
  toHaveProp,
  toHaveTextContent,
});
