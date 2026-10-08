import type { TestInstance } from 'test-renderer';

import {
  buildBlurEvent,
  buildContentSizeChangeEvent,
  buildEndEditingEvent,
  buildFocusEvent,
  buildTextChangeEvent,
  buildTextSelectionChangeEvent,
  isPointerEventEnabled,
  nativeState,
} from '../events/legacy';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import type { UserEventInstance } from './setup';
import { Interaction, getTextContentSize, wait, warnAboutUnhandledInteraction } from './utils';

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

  const interaction = new Interaction('paste', instance);
  if (!isEditableTextInput(instance) || !isPointerEventEnabled(instance)) {
    interaction.skippedTargets.push(instance);
    warnAboutUnhandledInteraction(interaction);
    return;
  }

  // 1. Enter instance
  await interaction.dispatchEvent('focus', buildFocusEvent());

  // 2. Select all
  const textToClear = getTextInputValue(instance);
  const rangeToClear = { start: 0, end: textToClear.length };
  await interaction.dispatchEvent('selectionChange', buildTextSelectionChangeEvent(rangeToClear));

  // 3. Paste the text
  nativeState.valueForInstance.set(instance, text);
  interaction.hasUpdatedNativeState = true;

  const rangeAfter = { start: text.length, end: text.length };
  await interaction.dispatchEvent('change', buildTextChangeEvent(text, rangeAfter));
  await interaction.dispatchEvent('changeText', text);
  await interaction.dispatchEvent('selectionChange', buildTextSelectionChangeEvent(rangeAfter));

  // According to the docs only multiline TextInput emits contentSizeChange event
  // @see: https://reactnative.dev/docs/textinput#oncontentsizechange
  const isMultiline = instance.props.multiline === true;
  if (isMultiline) {
    const contentSize = getTextContentSize(text);
    await interaction.dispatchEvent('contentSizeChange', buildContentSizeChangeEvent(contentSize));
  }

  // 4. Exit instance
  await wait(this.config);
  await interaction.dispatchEvent('endEditing', buildEndEditingEvent(text));
  await interaction.dispatchEvent('blur', buildBlurEvent());

  warnAboutUnhandledInteraction(interaction);
}
