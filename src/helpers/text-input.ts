import { ReactTestInstance } from 'react-test-renderer';
import { nativeState } from '../native-state';
import { isHostTextInput } from './host-component-names';

export function isTextInputEditable(element: ReactTestInstance) {
  if (!isHostTextInput(element)) {
    throw new Error(`Element is not a "TextInput", but it has type "${element.type}".`);
  }

  return element.props.editable !== false;
}

export function getTextInputValue(element: ReactTestInstance) {
  if (!isHostTextInput(element)) {
    throw new Error(`Element is not a "TextInput", but it has type "${element.type}".`);
  }

  return (
    element.props.value ??
    nativeState?.valueForElement.get(element) ??
    element.props.defaultValue ??
    ''
  );
}
