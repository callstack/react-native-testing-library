import type { TestInstance } from 'test-renderer';

// Host components that render RN `<Text>`, i.e. text elements holding their
// content as string children.
export const HOST_TEXT_NAMES = ['Text', 'RCTText'];

const HOST_TEXT_INPUT_NAMES = ['TextInput'];
const HOST_IMAGE_NAMES = ['Image'];
const HOST_SWITCH_NAMES = ['RCTSwitch'];
const HOST_SCROLL_VIEW_NAMES = ['RCTScrollView'];
const HOST_MODAL_NAMES = ['Modal'];

// Custom host text component holding its text content in the `text` prop
// instead of as string children: `<PlainText>` from `react-native-plain-text`.
const HOST_PLAIN_TEXT_NAME = 'RNPlainText';

/**
 * Checks if the given element is a custom host text element, i.e. one that
 * holds its text content in a prop instead of as string children, e.g.
 * `<PlainText>` from `react-native-plain-text`.
 * @param instance The instance to check.
 */
export function isCustomHostText(instance: TestInstance | null) {
  return instance?.type === HOST_PLAIN_TEXT_NAME;
}

/**
 * Checks if the given element is a host text element: either a RN `<Text>`,
 * holding its content as string children, or a custom one, holding it in a prop.
 * @param instance The instance to check.
 */
export function isHostText(instance: TestInstance | null) {
  if (typeof instance?.type !== 'string') {
    return false;
  }

  return HOST_TEXT_NAMES.includes(instance.type) || instance.type === HOST_PLAIN_TEXT_NAME;
}

/**
 * Returns the text content held in a prop by a custom host text element, or
 * `undefined` for any other element.
 * @param instance The instance to read.
 */
export function getCustomTextValue(instance: TestInstance | null): string | undefined {
  if (instance?.type !== HOST_PLAIN_TEXT_NAME) {
    return undefined;
  }

  const { text } = instance.props;
  if (typeof text === 'string') {
    return text;
  }

  return typeof text === 'number' ? String(text) : undefined;
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
