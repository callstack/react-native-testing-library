import { CommonEventBuilder } from './common';
import { ScrollViewEventBuilder } from './scroll-view';
import { TextInputEventBuilder } from './text-input';

export const EventBuilder = {
  Common: CommonEventBuilder,
  ScrollView: ScrollViewEventBuilder,
  TextInput: TextInputEventBuilder,
};
