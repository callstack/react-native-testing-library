import type { ReactTestInstance } from 'react-test-renderer';

import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { isPointerEventEnabled } from '../helpers/pointer-events';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import { nativeState } from '../native-state';
import { EventBuilder } from './event-builder';
import type { UserEventInstance } from './setup';
import { dispatchEvent, getTextContentSize, wait } from './utils';
import { formatElement } from '../helpers/format-element';
import { logger } from '../helpers/logger';

export async function paste(
  this: UserEventInstance,
  element: ReactTestInstance,
  text: string,
): Promise<void> {
  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `paste() only supports host "TextInput" elements. Passed element has type: "${element.type}".`,
      paste,
    );
  }

  if (!isEditableTextInput(element)) {
    logger.warn(
      `User Event (paste): element ${formatElement(element, { compact: true })} is not editable.`,
    );
    return;
  }

  if (!isPointerEventEnabled(element)) {
    logger.warn(
      `User Event (paste): element ${formatElement(element, { compact: true })} has pointer event handlers disabled.`,
    );
    return;
  }

  // 1. Enter element
  await dispatchEvent(element, 'focus', EventBuilder.Common.focus());

  // 2. Select all
  const textToClear = getTextInputValue(element);
  const rangeToClear = { start: 0, end: textToClear.length };
  await dispatchEvent(
    element,
    'selectionChange',
    EventBuilder.TextInput.selectionChange(rangeToClear),
  );

  // 3. Paste the text
  nativeState.valueForElement.set(element, text);
  await dispatchEvent(element, 'change', EventBuilder.TextInput.change(text));
  await dispatchEvent(element, 'changeText', text);

  const rangeAfter = { start: text.length, end: text.length };
  await dispatchEvent(
    element,
    'selectionChange',
    EventBuilder.TextInput.selectionChange(rangeAfter),
  );

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  const isMultiline = element.props.multiline === true;
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await dispatchEvent(
      element,
      'contentSizeChange',
      EventBuilder.TextInput.contentSizeChange(contentSize),
    );
  }

  // 4. Exit element
  await wait(this.config);
  await dispatchEvent(element, 'endEditing', EventBuilder.TextInput.endEditing(text));
  await dispatchEvent(element, 'blur', EventBuilder.Common.blur());
}
