import { HostElement } from 'universal-test-renderer';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { isPointerEventEnabled } from '../helpers/pointer-events';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import { nativeState } from '../native-state';
import { EventBuilder } from './event-builder';
import { UserEventInstance } from './setup';
import { dispatchEvent, getTextContentSize, wait } from './utils';

export async function paste(
  this: UserEventInstance,
  element: HostElement,
  text: string,
): Promise<void> {
  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `paste() only supports host "TextInput" elements. Passed element has type: "${element.type}".`,
      paste,
    );
  }

  if (!isEditableTextInput(element) || !isPointerEventEnabled(element)) {
    return;
  }

  // 1. Enter element
  dispatchEvent(element, 'focus', EventBuilder.Common.focus());

  // 2. Select all
  const textToClear = getTextInputValue(element);
  const rangeToClear = { start: 0, end: textToClear.length };
  dispatchEvent(element, 'selectionChange', EventBuilder.TextInput.selectionChange(rangeToClear));

  // 3. Paste the text
  nativeState.valueForElement.set(element, text);
  dispatchEvent(element, 'change', EventBuilder.TextInput.change(text));
  dispatchEvent(element, 'changeText', text);

  const rangeAfter = { start: text.length, end: text.length };
  dispatchEvent(element, 'selectionChange', EventBuilder.TextInput.selectionChange(rangeAfter));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  const isMultiline = element.props.multiline === true;
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    dispatchEvent(
      element,
      'contentSizeChange',
      EventBuilder.TextInput.contentSizeChange(contentSize),
    );
  }

  // 4. Exit element
  await wait(this.config);
  dispatchEvent(element, 'endEditing', EventBuilder.TextInput.endEditing(text));
  dispatchEvent(element, 'blur', EventBuilder.Common.blur());
}
