import type { HostElement } from 'test-renderer';

import {
  buildBlurEvent,
  buildContentSizeChangeEvent,
  buildEndEditingEvent,
  buildFocusEvent,
  buildTextChangeEvent,
  buildTextSelectionChangeEvent,
} from '../event-builder';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { isPointerEventEnabled } from '../helpers/pointer-events';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import { nativeState } from '../native-state';
import type { UserEventInstance } from './setup';
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
  await dispatchEvent(element, 'focus', buildFocusEvent());

  // 2. Select all
  const textToClear = getTextInputValue(element);
  const rangeToClear = { start: 0, end: textToClear.length };
  await dispatchEvent(element, 'selectionChange', buildTextSelectionChangeEvent(rangeToClear));

  // 3. Paste the text
  nativeState.valueForElement.set(element, text);
  await dispatchEvent(element, 'change', buildTextChangeEvent(text));
  await dispatchEvent(element, 'changeText', text);

  const rangeAfter = { start: text.length, end: text.length };
  await dispatchEvent(element, 'selectionChange', buildTextSelectionChangeEvent(rangeAfter));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  const isMultiline = element.props.multiline === true;
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await dispatchEvent(element, 'contentSizeChange', buildContentSizeChangeEvent(contentSize));
  }

  // 4. Exit element
  await wait(this.config);
  await dispatchEvent(element, 'endEditing', buildEndEditingEvent(text));
  await dispatchEvent(element, 'blur', buildBlurEvent());
}
