---
id: user-event
title: User Event
---

### Table of contents

- [`userEvent.setup`](#usereventsetup)
  - [Options](#options)


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