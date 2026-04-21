import type { TestInstance } from 'test-renderer';

export const HOST_TEXT_NAMES = ['Text', 'RCTText'];
const HOST_TEXT_INPUT_NAMES = ['TextInput'];
const HOST_IMAGE_NAMES = ['Image'];
const HOST_SWITCH_NAMES = ['RCTSwitch'];
const HOST_SCROLL_VIEW_NAMES = ['RCTScrollView'];
const HOST_MODAL_NAMES = ['Modal'];

/**
 * Checks if the given element is a host Text element.
 * @param instance The instance to check.
 */
export function isHostText(instance: TestInstance | null) {
  return typeof instance?.type === 'string' && HOST_TEXT_NAMES.includes(instance.type);
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
