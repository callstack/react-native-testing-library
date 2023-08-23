/// <reference path="./extend-expect.d.ts" />

import { toBeOnTheScreen } from './to-be-on-the-screen';
import { toBeEmptyElement } from './to-be-empty-element';
import { toBeVisible } from './to-be-visible';
import { toHaveDisplayValue } from './to-have-display-value';
import { toHaveTextContent } from './to-have-text-content';
import { toBeDisabled } from './to-be-disabled';

expect.extend({
  toBeOnTheScreen,
  toBeEmptyElement,
  toBeVisible,
  toHaveDisplayValue,
  toHaveTextContent,
  toBeDisabled,
});
