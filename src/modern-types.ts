/**
 * Switches `fireEvent` types to the modern event system. Users import it as
 * `@testing-library/react-native/modern-types`, next to `configure({ eventSystem: 'modern' })`.
 *
 * Not part of the main tsconfig program, as the augmentation would apply to all tests.
 */
export {};

declare module './events/fire-event' {
  interface Register {
    eventSystem: 'modern';
  }
}
