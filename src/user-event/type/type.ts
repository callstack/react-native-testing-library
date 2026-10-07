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
  isPointerEventEnabled,
  nativeState,
} from '../../events';
import { ErrorWithStack } from '../../helpers/errors';
import { isHostTextInput } from '../../helpers/host-component-names';
import { getTextInputValue, isEditableTextInput } from '../../helpers/text-input';
import type { UserEventConfig, UserEventInstance } from '../setup';
import { Interaction, getTextContentSize, wait, warnAboutUnhandledInteraction } from '../utils';
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

  const interaction = new Interaction('type', instance);
  if (!isEditableTextInput(instance) || !isPointerEventEnabled(instance)) {
    interaction.skippedTargets.push(instance);
    warnAboutUnhandledInteraction(interaction);
    return;
  }

  const keys = parseKeys(text);

  if (!options?.skipPress) {
    await interaction.dispatchEvent('pressIn', buildTouchEvent());
  }

  await interaction.dispatchEvent('focus', buildFocusEvent());

  if (!options?.skipPress) {
    await wait(this.config);
    await interaction.dispatchEvent('pressOut', buildTouchEvent());
  }

  for (const key of keys) {
    const previousText = getTextInputValue(instance);
    const proposedText = applyKey(previousText, key);
    const isAccepted = isTextChangeAccepted(instance, proposedText);
    const currentText = isAccepted ? proposedText : previousText;

    await emitTypingEvents(instance, {
      config: this.config,
      interaction,
      key,
      text: currentText,
      isAccepted,
    });
  }

  const finalText = getTextInputValue(instance);
  await wait(this.config);

  if (options?.submitEditing) {
    await interaction.dispatchEvent('submitEditing', buildSubmitEditingEvent(finalText));
  }

  if (!options?.skipBlur) {
    await interaction.dispatchEvent('endEditing', buildEndEditingEvent(finalText));
    await interaction.dispatchEvent('blur', buildBlurEvent());
  }

  warnAboutUnhandledInteraction(interaction);
}

type EmitTypingEventsContext = {
  config: UserEventConfig;
  interaction: Interaction;
  key: string;
  text: string;
  isAccepted?: boolean;
};

export async function emitTypingEvents(
  instance: TestInstance,
  { config, interaction, key, text, isAccepted }: EmitTypingEventsContext,
) {
  const isMultiline = instance.props.multiline === true;

  await wait(config);
  await interaction.dispatchEvent('keyPress', buildKeyPressEvent(key));

  // Platform difference (based on experiments):
  // - iOS and RN Web: TextInput emits only `keyPress` event when max length has been reached
  // - Android: TextInputs does not emit any events
  if (isAccepted === false) {
    return;
  }

  nativeState.valueForInstance.set(instance, text);
  interaction.hasUpdatedNativeState = true;

  const selectionRange = {
    start: text.length,
    end: text.length,
  };

  await interaction.dispatchEvent('change', buildTextChangeEvent(text, selectionRange));
  await interaction.dispatchEvent('changeText', text);
  await interaction.dispatchEvent('selectionChange', buildTextSelectionChangeEvent(selectionRange));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await interaction.dispatchEvent('contentSizeChange', buildContentSizeChangeEvent(contentSize));
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
