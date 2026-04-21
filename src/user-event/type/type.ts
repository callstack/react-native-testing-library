import type { TestInstance } from 'test-renderer';

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
  instance: TestInstance,
  text: string,
  options?: TypeOptions,
): Promise<void> {
  if (!isHostTextInput(instance)) {
    throw new ErrorWithStack(
      `type() works only with host "TextInput" instances. Passed instance has type "${instance.type}".`,
      type,
    );
  }

  // Skip events if the instance is disabled
  if (!isEditableTextInput(instance) || !isPointerEventEnabled(instance)) {
    return;
  }

  const keys = parseKeys(text);

  if (!options?.skipPress) {
    await dispatchEvent(instance, 'pressIn', buildTouchEvent());
  }

  await dispatchEvent(instance, 'focus', buildFocusEvent());

  if (!options?.skipPress) {
    await wait(this.config);
    await dispatchEvent(instance, 'pressOut', buildTouchEvent());
  }

  for (const key of keys) {
    const previousText = getTextInputValue(instance);
    const proposedText = applyKey(previousText, key);
    const isAccepted = isTextChangeAccepted(instance, proposedText);
    const currentText = isAccepted ? proposedText : previousText;

    await emitTypingEvents(instance, {
      config: this.config,
      key,
      text: currentText,
      isAccepted,
    });
  }

  const finalText = getTextInputValue(instance);
  await wait(this.config);

  if (options?.submitEditing) {
    await dispatchEvent(instance, 'submitEditing', buildSubmitEditingEvent(finalText));
  }

  if (!options?.skipBlur) {
    await dispatchEvent(instance, 'endEditing', buildEndEditingEvent(finalText));
    await dispatchEvent(instance, 'blur', buildBlurEvent());
  }
}

type EmitTypingEventsContext = {
  config: UserEventConfig;
  key: string;
  text: string;
  isAccepted?: boolean;
};

export async function emitTypingEvents(
  instance: TestInstance,
  { config, key, text, isAccepted }: EmitTypingEventsContext,
) {
  const isMultiline = instance.props.multiline === true;

  await wait(config);
  await dispatchEvent(instance, 'keyPress', buildKeyPressEvent(key));

  // Platform difference (based on experiments):
  // - iOS and RN Web: TextInput emits only `keyPress` event when max length has been reached
  // - Android: TextInputs does not emit any events
  if (isAccepted === false) {
    return;
  }

  nativeState.valueForInstance.set(instance, text);
  await dispatchEvent(instance, 'change', buildTextChangeEvent(text));
  await dispatchEvent(instance, 'changeText', text);

  const selectionRange = {
    start: text.length,
    end: text.length,
  };
  await dispatchEvent(instance, 'selectionChange', buildTextSelectionChangeEvent(selectionRange));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await dispatchEvent(instance, 'contentSizeChange', buildContentSizeChangeEvent(contentSize));
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

function isTextChangeAccepted(instance: TestInstance, text: string) {
  const maxLength = instance.props.maxLength;
  return maxLength === undefined || text.length <= maxLength;
}
