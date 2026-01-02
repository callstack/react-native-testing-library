import type { HostElement } from 'universal-test-renderer';

const HOST_TEXT_NAMES = ['Text', 'RCTText'];
const HOST_TEXT_INPUT_NAMES = ['TextInput'];
const HOST_IMAGE_NAMES = ['Image'];
const HOST_SWITCH_NAMES = ['RCTSwitch'];
const HOST_SCROLL_VIEW_NAMES = ['RCTScrollView'];
const HOST_MODAL_NAMES = ['Modal'];

/**
 * Checks if the given element is a host Text element.
 * @param element The element to check.
 */
export function isHostText(element: HostElement | null) {
  return typeof element?.type === 'string' && HOST_TEXT_NAMES.includes(element.type);
}

/**
 * Checks if the given element is a host TextInput element.
 * @param element The element to check.
 */
export function isHostTextInput(element: HostElement | null) {
  return typeof element?.type === 'string' && HOST_TEXT_INPUT_NAMES.includes(element.type);
}

/**
 * Checks if the given element is a host Image element.
 * @param element The element to check.
 */
export function isHostImage(element: HostElement | null) {
  return typeof element?.type === 'string' && HOST_IMAGE_NAMES.includes(element.type);
}

/**
 * Checks if the given element is a host Switch element.
 * @param element The element to check.
 */
export function isHostSwitch(element: HostElement | null) {
  return typeof element?.type === 'string' && HOST_SWITCH_NAMES.includes(element.type);
}

/**
 * Checks if the given element is a host ScrollView element.
 * @param element The element to check.
 */
export function isHostScrollView(element: HostElement | null) {
  return typeof element?.type === 'string' && HOST_SCROLL_VIEW_NAMES.includes(element.type);
}

/**
 * Checks if the given element is a host Modal element.
 * @param element The element to check.
 */
export function isHostModal(element: HostElement | null) {
  return typeof element?.type === 'string' && HOST_MODAL_NAMES.includes(element.type);
}
