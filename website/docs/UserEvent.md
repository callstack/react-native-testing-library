---
id: user-event
title: User Event
---

### Table of contents

- [`userEvent.setup`](#usereventsetup)
  - [Options](#options)
- [`press()`](#press)
- [`longPress()`](#longpress)
- [`type()`](#type)
  - [Options:](#options-1)
  - [Sequence of events](#sequence-of-events)


## `userEvent.setup`

```ts
userEvent.setup(options?: {
  delay: number;
  advanceTimers: (delay: number) => Promise<void> | void;
})
```

Example
```ts
const user = userEvent.setup();
```

Creates User Event instances which can be used to trigger events.

### Options
- `delay` - controls the default delay between subsequent events, e.g. keystrokes, etc.
- `advanceTimers` - time advancement utility function that should be used for fake timers. The default setup handles both real and Jest fake timers.


## `press()`

```ts
press(
  element: ReactTestInstance,
): Promise<void>
```

Example
```ts
const user = userEvent.setup();
await user.press(element);
```

This helper simulates a press on any pressable element, e.g. `Pressable`, `TouchableOpacity`, `Text`, `TextInput`, etc. Unlike `fireEvent.press()` which is a simpler API that will only call the `onPress` prop, this simulates the entire press event in a more realistic way by reproducing what really happens when a user presses an interface view. This will trigger additional events like `pressIn` and `pressOut`. 

## `longPress()`

```ts
longPress(
  element: ReactTestInstance,
  options: { duration: number } = { duration: 500 }
): Promise<void>
```

Example
```ts
const user = userEvent.setup();
await user.longPress(element);
```

Simulates a long press user interaction. In React Native the `longPress` event is emitted when the press duration exceeds long press threshold (by default 500 ms). In other aspects this actions behaves similar to regular `press` action, e.g. by emitting `pressIn` and `pressOut` events. The press duration is customisable through the options. This should be useful if you use the `delayLongPress` prop. When using real timers this will take 500 ms so it is highly recommended to use that API with fake timers to prevent test taking a long time to run. 

## `type()`

```ts
type(
  element: ReactTestInstance,
  text: string,
  options?: {
    skipPress?: boolean
    submitEditing?: boolean
  }
```

Example
```ts
const user = userEvent.setup();
await user.type(textInput, "Hello world!");
```

This helper simulates user focusing on `TextInput` element, typing `text` one character at a time, and leaving the element.

This function supports only host `TextInput` elements. Passing other element type will result in throwing error.

### Options:
 - `skipPress` - if true, `pressIn` and `pressOut` events will not be triggered.
 - `submitEditing` - if true, `submitEditing` event will be triggered after typing the text.

### Sequence of events

The sequence of events depends on `multiline` prop, as well as passed options.

Events will not be emitted if `editable` prop is set to `false`.

Entering the element:
- `pressIn` (optional)
- `focus`
- `pressOut` (optional)

The `pressIn` and `pressOut` events are send by default, but can be skipped by passing `skipPress: true` option.

Typing (for each character):
- `keyPress`
- `textInput` (optional)
- `change`
- `changeText`
- `selectionChange`

The `textInput` event is sent only for mutliline text inputs.

Leaving the element:
- `submitEditing` (optional)
- `endEditing`
- `blur`

The `submitEditing` event is skipped by default. It can be send by setting `submitEditing: true` option.
