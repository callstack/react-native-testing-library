# Native State

On a device, some component state lives in native views, not in React. Jest has no native views, so RNTL keeps this state itself in `src/events/legacy/native-state.ts`.

## What is stored

- **`TextInput` value** (`valueForInstance`): the text in an uncontrolled `TextInput`. Without it, the input would show no text after `user.type()`.
- **`ScrollView` content offset** (`contentOffsetForInstance`): the current scroll position. Without it, every `scrollTo()` would start from `0, 0`.
- **Layout size** (`layoutSizeForInstance`): an element's width and height from the last `layout` event. Scroll events use it as the `ScrollView`'s default `layoutMeasurement`.

## Key points

- **Writes.** `fireEvent` and `userEvent` update native state when they simulate a change that a native view would make. `fireEvent` does it through `updateNativeStateFromEvent()` in `src/events/legacy/update-native-state.ts`. Each `userEvent` action writes it directly.
- **Reads.** Helpers read native state, like `getTextInputValue()` in `src/helpers/text-input.ts`. Queries and matchers use those helpers instead of reading native state directly.
- **Props win.** A controlled prop (like `value`) always takes precedence over native state.
- **No reset.** State is stored in `WeakMap`s keyed by host instance. It disappears when the instance is unmounted, so `cleanup()` doesn't need to clear it.
- **Internal.** Native state isn't part of the public API.
