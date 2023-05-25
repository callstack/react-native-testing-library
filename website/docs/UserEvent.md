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
type(
  element: ReactTestInstance,
): Promise<void>
```

Example
```ts
const user = userEvent.setup();

await user.press(touchable);
```

This helper simulates a press on any pressable element, e.g. Pressable, Text or TextInput. Unlike fireEvent.press which is a simpler API that will only call the onPress prop, this simumlates the entire press event in a more realistic way by reproducing what really happens when a user presses a pressable component. This means for instance for onPressIn and onPressOut props will also be invoked.  

## `longPress()`

```ts
type(
  element: ReactTestInstance,
  options: { pressDuration: number } = { pressDuration: 500 }
): Promise<void>
```

Example
```ts
const user = userEvent.setup();

await user.longPress(touchable);
```

Simulates a press of long duration. In React Native the `onLongPress` prop is called if the press duration is at least 500ms which is the default duration for this helper. Other than the press duration this will behave exactly as `press`. The duration is customizable through the options. This should be useful if you use the `delayLongPress` prop. When using real timers this will take 500ms so it is highly recommended to use that API with fake timers to prevent test taking a long time to run. 