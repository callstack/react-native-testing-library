import type { TestInstance } from 'test-renderer';

import {
  buildBlurEvent,
  buildEndEditingEvent,
  buildFocusEvent,
  buildTextSelectionChangeEvent,
  isPointerEventEnabled,
} from '../events/legacy';
import { ErrorWithStack } from '../helpers/errors';
import { isHostTextInput } from '../helpers/host-component-names';
import { getTextInputValue, isEditableTextInput } from '../helpers/text-input';
import type { UserEventInstance } from './setup';
import { emitTypingEvents } from './type/type';
import { Interaction, wait, warnAboutUnhandledInteraction } from './utils';

export async function clear(this: UserEventInstance, instance: TestInstance): Promise<void> {
  if (!isHostTextInput(instance)) {
    throw new ErrorWithStack(
      `clear() only supports host "TextInput" instances. Passed instance has type: "${instance.type}".`,
      clear,
    );
  }

  const interaction = new Interaction('clear', instance);
  if (!isEditableTextInput(instance) || !isPointerEventEnabled(instance)) {
    interaction.skippedTargets.push(instance);
    warnAboutUnhandledInteraction(interaction);
    return;
  }

  // 1. Enter instance
  await interaction.dispatchEvent('focus', buildFocusEvent());

  // 2. Select all
  const textToClear = getTextInputValue(instance);
  const selectionRange = {
    start: 0,
    end: textToClear.length,
  };
  await interaction.dispatchEvent('selectionChange', buildTextSelectionChangeEvent(selectionRange));

  // 3. Press backspace with selected text
  const emptyText = '';
  await emitTypingEvents(instance, {
    config: this.config,
    interaction,
    key: 'Backspace',
    text: emptyText,
  });

  // 4. Exit instance
  await wait(this.config);
  await interaction.dispatchEvent('endEditing', buildEndEditingEvent(emptyText));
  await interaction.dispatchEvent('blur', buildBlurEvent());

  warnAboutUnhandledInteraction(interaction);
}
