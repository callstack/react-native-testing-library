import { createLibraryNotSupportedError } from './errors';

export function importTextFromReactNative() {
  try {
    const { Text } = require('react-native');
    return Text;
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
}

export function importTextInputFromReactNative() {
  try {
    const { TextInput } = require('react-native');
    return TextInput;
  } catch (error) {
    throw createLibraryNotSupportedError(error);
  }
}
