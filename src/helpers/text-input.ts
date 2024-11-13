import { HostElement } from 'universal-test-renderer';
import { nativeState } from '../native-state';
import { isHostTextInput } from './host-component-names';

export function isEditableTextInput(element: HostElement) {
  return isHostTextInput(element) && element.props.editable !== false;
}

export function getTextInputValue(element: HostElement) {
  if (!isHostTextInput(element)) {
    throw new Error(`Element is not a "TextInput", but it has type "${element.type}".`);
  }

  return (
    element.props.value ??
    nativeState.valueForElement.get(element) ??
    element.props.defaultValue ??
    ''
  );
}
