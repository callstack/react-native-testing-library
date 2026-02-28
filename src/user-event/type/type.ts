import type { HostElement } from 'test-renderer';

import {
  buildBlurEvent,
  buildContentSizeChangeEvent,
  buildEndEditingEvent,
  buildFocusEvent,
  buildKeyPressEvent,
  buildSubmitEditingEvent,
  buildTextChangeEvent,
  buildTextSelectionChangeEvent,
  buildTouchEvent,
} from '../../event-builder';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostTextInput } from '../../helpers/host-component-names';
import { isPointerEventEnabled } from '../../helpers/pointer-events';
import { getTextInputValue, isEditableTextInput } from '../../helpers/text-input';
import { nativeState } from '../../native-state';
import type { UserEventConfig, UserEventInstance } from '../setup';
import { dispatchEvent, getTextContentSize, wait } from '../utils';
import { parseKeys } from './parse-keys';

export interface TypeOptions {
  skipPress?: boolean;
  submitEditing?: boolean;
  skipBlur?: boolean;
}

export async function type(
  this: UserEventInstance,
  element: HostElement,
  text: string,
  options?: TypeOptions,
): Promise<void> {
  if (!isHostTextInput(element)) {
    throw new ErrorWithStack(
      `type() works only with host "TextInput" elements. Passed element has type "${element.type}".`,
      type,
    );
  }

  // Skip events if the element is disabled
  if (!isEditableTextInput(element) || !isPointerEventEnabled(element)) {
    return;
  }

  const keys = parseKeys(text);

  if (!options?.skipPress) {
    await dispatchEvent(element, 'pressIn', buildTouchEvent());
  }

  await dispatchEvent(element, 'focus', buildFocusEvent());

  if (!options?.skipPress) {
    await wait(this.config);
    await dispatchEvent(element, 'pressOut', buildTouchEvent());
  }

  let currentText = getTextInputValue(element);
  for (const key of keys) {
    const previousText = getTextInputValue(element);
    const proposedText = applyKey(previousText, key);
    const isAccepted = isTextChangeAccepted(element, proposedText);
    currentText = isAccepted ? proposedText : previousText;

    await emitTypingEvents(element, {
      config: this.config,
      key,
      text: currentText,
      isAccepted,
    });
  }

  const finalText = getTextInputValue(element);
  await wait(this.config);

  if (options?.submitEditing) {
    await dispatchEvent(element, 'submitEditing', buildSubmitEditingEvent(finalText));
  }

  if (!options?.skipBlur) {
    await dispatchEvent(element, 'endEditing', buildEndEditingEvent(finalText));
    await dispatchEvent(element, 'blur', buildBlurEvent());
  }
}

type EmitTypingEventsContext = {
  config: UserEventConfig;
  key: string;
  text: string;
  isAccepted?: boolean;
};

export async function emitTypingEvents(
  element: HostElement,
  { config, key, text, isAccepted }: EmitTypingEventsContext,
) {
  const isMultiline = element.props.multiline === true;

  await wait(config);
  await dispatchEvent(element, 'keyPress', buildKeyPressEvent(key));

  // Platform difference (based on experiments):
  // - iOS and RN Web: TextInput emits only `keyPress` event when max length has been reached
  // - Android: TextInputs does not emit any events
  if (isAccepted === false) {
    return;
  }

  nativeState.valueForElement.set(element, text);
  await dispatchEvent(element, 'change', buildTextChangeEvent(text));
  await dispatchEvent(element, 'changeText', text);

  const selectionRange = {
    start: text.length,
    end: text.length,
  };
  await dispatchEvent(element, 'selectionChange', buildTextSelectionChangeEvent(selectionRange));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await dispatchEvent(element, 'contentSizeChange', buildContentSizeChangeEvent(contentSize));
  }
}

function applyKey(text: string, key: string) {
  if (key === 'Enter') {
    return `${text}\n`;
  }

  if (key === 'Backspace') {
    return text.slice(0, -1);
  }

  return text + key;
}

function isTextChangeAccepted(element: HostElement, text: string) {
  const maxLength = element.props.maxLength;
  return maxLength === undefined || text.length <= maxLength;
}
