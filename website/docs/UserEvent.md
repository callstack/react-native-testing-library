---
id: user-event
title: User Event
---

### Table of contents

- [Comparison with Fire Event API](#comparison-with-fire-event-api)
- [`setup()`](#setup)
  - [Options](#options)
- [`press()`](#press)
- [`longPress()`](#longpress)
  - [Options](#options-1)
- [`type()`](#type)
  - [Options](#options-2)
  - [Sequence of events](#sequence-of-events)
- [`clear()`](#clear)
  - [Sequence of events](#sequence-of-events-1)

:::caution
User Event API is in beta stage.

This means that we plan to keep the public API signatures to remain stable, but we might introduce breaking behavioural changes, e.g. changing the ordering or timing of emitted events, without a major version update. Hopefully, well written code should not rely on such specific details.
:::

## Comparison with Fire Event API

Fire Event is our original event simulation API. It offers ability to invoke **any event handler** declared on **either host or composite elements**. If the element does not have `onEventName` event handler for passed `eventName` event, or the element is disabled, Fire Event will traverse up the component tree, looking for event handler on both host and composite elements along the way. By default it will **not pass any event data**, but the user might provide it in the last argument.

In contrast, User Event provides realistic event simulation for main user interactions like `press` or `type`. Each of the interactions will trigger a **sequence of events** corresponding to React Native runtime behavior. These events will be invoked **only on host elements**, and **will automatically receive event data** corresponding to each event.

If User Event supports given interaction you should always prefer it over Fire Event counterpart, as it will make your tests much more realistic and hence reliable. In other cases, e.g. when event is not supported by User Event, or when invoking event handlers on composite elements, you have to use Fire Event as the only available option.

## `setup()`

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

Creates an User Event object instance which can be used to trigger events.

### Options
- `delay` - controls the default delay between subsequent events, e.g. keystrokes.
- `advanceTimers` - time advancement utility function that should be used for fake timers. The default setup handles both real timers and Jest fake timers.


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

This helper simulates a press on any pressable element, e.g. `Pressable`, `TouchableOpacity`, `Text`, `TextInput`, etc. Unlike `fireEvent.press()` which is a simpler API that will only call the `onPress` prop, this function simulates the entire press interaction in a more realistic way by reproducing event sequence emitted by React Native runtime. This helper will trigger additional events like `pressIn` and `pressOut`. 

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

### Options
- `duration` - duration of the press in miliseconds. Default value is 500 ms.

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

:::note
This function will add text to the text already present in the text input (as specified by `value` or `defaultValue` props). In order to replace existing text, use [`clear()`](#clear) helper first.
:::

### Options
 - `skipPress` - if true, `pressIn` and `pressOut` events will not be triggered.
 - `submitEditing` - if true, `submitEditing` event will be triggered after typing the text.

### Sequence of events

The sequence of events depends on `multiline` prop, as well as passed options.

Events will not be emitted if `editable` prop is set to `false`.

**Entering the element**:
- `pressIn` (optional)
- `focus`
- `pressOut` (optional)

The `pressIn` and `pressOut` events are sent by default, but can be skipped by passing `skipPress: true` option.

**Typing (for each character)**:
- `keyPress`
- `textInput` (optional)
- `change`
- `changeText`
- `selectionChange`

The `textInput` event is sent only for mutliline text inputs.

**Leaving the element**:
- `submitEditing` (optional)
- `endEditing`
- `blur`

The `submitEditing` event is skipped by default. It can sent by setting `submitEditing: true` option.

## `clear()`

```ts
clear(
  element: ReactTestInstance,
}
```

Example
```ts
const user = userEvent.setup();
await user.clear(textInput);
```

This helper simulates user clearing content of `TextInput` element.

This function supports only host `TextInput` elements. Passing other element type will result in throwing error.

### Sequence of events

The sequence of events depends on `multiline` prop, as well as passed options.

Events will not be emitted if `editable` prop is set to `false`.

**Entering the element**:
- `focus`

**Selecting all content**:
- `selectionChange`

**Pressing backspace**:
- `keyPress`
- `textInput` (optional)
- `change`
- `changeText`
- `selectionChange`

The `textInput` event is sent only for mutliline text inputs.

**Leaving the element**:
- `endEditing`
- `blur`
