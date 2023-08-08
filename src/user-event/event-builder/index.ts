import { CommonEventBuilder } from './common';
import { ScrollEventBuilder } from './scroll';
import { TextInputEventBuilder } from './text-input';

export const EventBuilder = {
  Common: CommonEventBuilder,
  Scroll: ScrollEventBuilder,
  TextInput: TextInputEventBuilder,
};
