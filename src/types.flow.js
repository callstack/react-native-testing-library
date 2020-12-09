// @flow

export type Thenable = {
  then(resolve: () => mixed, reject?: () => mixed): mixed,
};

export type A11yRole =
  | 'none'
  | 'button'
  | 'link'
  | 'search'
  | 'image'
  | 'keyboardkey'
  | 'text'
  | 'adjustable'
  | 'imagebutton'
  | 'header'
  | 'summary'
  | 'alert'
  | 'checkbox'
  | 'combobox'
  | 'menu'
  | 'menubar'
  | 'menuitem'
  | 'progressbar'
  | 'radio'
  | 'radiogroup'
  | 'scrollbar'
  | 'spinbutton'
  | 'switch'
  | 'tab'
  | 'tablist'
  | 'timer'
  | 'toolbar';

export type A11yState = {|
  disabled?: boolean,
  selected?: boolean,
  checked?: boolean | 'mixed',
  busy?: boolean,
  expanded?: boolean,
|};

export type A11yStates =
  | 'disabled'
  | 'selected'
  | 'checked'
  | 'unchecked'
  | 'busy'
  | 'expanded'
  | 'collapsed'
  | 'hasPopup';

export type A11yValue = {
  min?: number,
  max?: number,
  now?: number,
  text?: string,
};
