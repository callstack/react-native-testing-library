import type { TestInstance } from 'test-renderer';

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
  instance: TestInstance,
  text: string,
): Promise<void> {
  if (!isHostTextInput(instance)) {
    throw new ErrorWithStack(
      `paste() only supports host "TextInput" instances. Passed instance has type: "${instance.type}".`,
      paste,
    );
  }

  if (!isEditableTextInput(instance) || !isPointerEventEnabled(instance)) {
    return;
  }

  // 1. Enter instance
  await dispatchEvent(instance, 'focus', buildFocusEvent());

  // 2. Select all
  const textToClear = getTextInputValue(instance);
  const rangeToClear = { start: 0, end: textToClear.length };
  await dispatchEvent(instance, 'selectionChange', buildTextSelectionChangeEvent(rangeToClear));

  // 3. Paste the text
  nativeState.valueForInstance.set(instance, text);
  await dispatchEvent(instance, 'change', buildTextChangeEvent(text));
  await dispatchEvent(instance, 'changeText', text);

  const rangeAfter = { start: text.length, end: text.length };
  await dispatchEvent(instance, 'selectionChange', buildTextSelectionChangeEvent(rangeAfter));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  const isMultiline = instance.props.multiline === true;
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await dispatchEvent(instance, 'contentSizeChange', buildContentSizeChangeEvent(contentSize));
  }

  // 4. Exit instance
  await wait(this.config);
  await dispatchEvent(instance, 'endEditing', buildEndEditingEvent(text));
  await dispatchEvent(instance, 'blur', buildBlurEvent());
}
