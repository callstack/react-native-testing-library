import type { TestInstance } from 'test-renderer';

// Host components that render RN `<Text>`, i.e. text elements holding their
// content as string children.
export const HOST_TEXT_NAMES = ['Text', 'RCTText'];

// Host components that hold their text content in the `text` prop instead of
// string children, e.g. `<PlainText>` from `react-native-plain-text`.
const HOST_PLAIN_TEXT_NAMES = ['RNPlainText'];
const HOST_TEXT_INPUT_NAMES = ['TextInput'];
const HOST_IMAGE_NAMES = ['Image'];
const HOST_SWITCH_NAMES = ['RCTSwitch'];
const HOST_SCROLL_VIEW_NAMES = ['RCTScrollView'];
const HOST_MODAL_NAMES = ['Modal'];

/**
 * Checks if the given element is a host plain text element, i.e. one that holds
 * its text content in the `text` prop, e.g. `<PlainText>` from
 * `react-native-plain-text`.
 * @param instance The instance to check.
 */
export function isHostPlainText(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_PLAIN_TEXT_NAMES.includes(instance.type);
}

/**
 * Checks if the given element is a host text element: either a RN `<Text>`,
 * holding its content as string children, or a plain text one, holding it in
 * the `text` prop.
 * @param instance The instance to check.
 */
export function isHostText(instance: TestInstance | null) {
  if (typeof instance?.type !== 'string') {
    return false;
  }

  return HOST_TEXT_NAMES.includes(instance.type) || HOST_PLAIN_TEXT_NAMES.includes(instance.type);
}

/**
 * Returns the text held directly by a host plain text element, if any.
 * @param instance The instance to read.
 */
export function getHostPlainTextValue(instance: TestInstance | null): string | undefined {
  if (instance == null || !isHostPlainText(instance)) {
    return undefined;
  }

  const { text } = instance.props;
  return typeof text === 'string' || typeof text === 'number' ? String(text) : undefined;
}

/**
 * Checks if the given element is a host TextInput element.
 * @param instance The instance to check.
 */
export function isHostTextInput(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_TEXT_INPUT_NAMES.includes(instance.type);
}

/**
 * Checks if the given element is a host Image element.
 * @param instance The instance to check.
 */
export function isHostImage(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_IMAGE_NAMES.includes(instance.type);
}

/**
 * Checks if the given element is a host Switch element.
 * @param instance The instance to check.
 */
export function isHostSwitch(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_SWITCH_NAMES.includes(instance.type);
}

/**
 * Checks if the given element is a host ScrollView element.
 * @param instance The instance to check.
 */
export function isHostScrollView(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_SCROLL_VIEW_NAMES.includes(instance.type);
}

/**
 * Checks if the given element is a host Modal element.
 * @param instance The instance to check.
 */
export function isHostModal(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_MODAL_NAMES.includes(instance.type);
}
