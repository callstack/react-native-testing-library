import { toBeOnTheScreen } from './to-be-on-the-screen';
import { toBeChecked } from './to-be-checked';
import { toBeCollapsed } from './to-be-collapsed';
import { toBeDisabled, toBeEnabled } from './to-be-disabled';
import { toBeBusy } from './to-be-busy';
import { toBeEmptyElement } from './to-be-empty-element';
import { toBeExpanded } from './to-be-expanded';
import { toBePartiallyChecked } from './to-be-partially-checked';
import { toBeSelected } from './to-be-selected';
import { toBeVisible } from './to-be-visible';
import { toContainElement } from './to-contain-element';
import { toHaveAccessibilityValue } from './to-have-accessibility-value';
import { toHaveAccessibleName } from './to-have-accessible-name';
import { toHaveDisplayValue } from './to-have-display-value';
import { toHaveProp } from './to-have-prop';
import { toHaveStyle } from './to-have-style';
import { toHaveTextContent } from './to-have-text-content';

export type * from './types';

expect.extend({
  toBeOnTheScreen,
  toBeChecked,
  toBeCollapsed,
  toBeDisabled,
  toBeBusy,
  toBeEmptyElement,
  toBeEnabled,
  toBeExpanded,
  toBePartiallyChecked,
  toBeSelected,
  toBeVisible,
  toContainElement,
  toHaveAccessibilityValue,
  toHaveAccessibleName,
  toHaveDisplayValue,
  toHaveProp,
  toHaveStyle,
  toHaveTextContent,
});
