---
id: user-event
title: User Event
---

:::note
User Event interactions require RNTL v12.2.0 or later.
:::

import TOCInline from '@theme/TOCInline';

<TOCInline toc={toc} />

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

### Options {#setup-options}

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

### Options {#longpress-options}

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
await user.type(textInput, 'Hello world!');
```

This helper simulates user focusing on `TextInput` element, typing `text` one character at a time, and leaving the element.

This function supports only host `TextInput` elements. Passing other element type will result in throwing error.

:::note
This function will add text to the text already present in the text input (as specified by `value` or `defaultValue` props). In order to replace existing text, use [`clear()`](#clear) helper first.
:::

### Options {#type-options}

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

## `scrollTo()`

:::note
`scrollTo` interaction has been introduced in RNTL v12.4.0.
:::

```ts
scrollTo(
  element: ReactTestInstance,
  options: {
    y: number,
    momentumY?: number,
    contentSize?: { width: number, height: number },
    layoutMeasurement?: { width: number, height: number },
  } | {
    x: number,
    momentumX?: number,
    contentSize?: { width: number, height: number },
    layoutMeasurement?: { width: number, height: number },
  }
```

Example

```ts
const user = userEvent.setup();
await user.scrollTo(scrollView, { y: 100, momentumY: 200 });
```

This helper simulates user scrolling a host `ScrollView` element.

This function supports only host `ScrollView` elements, passing other element types will result in error. Note that `FlatList` is accepted as it renders to a host `ScrolLView` element.

Scroll interaction should match `ScrollView` element direction. For vertical scroll view (default or explicit `horizontal={false}`) you should pass only `y` (and optionally also `momentumY`) option, for horizontal scroll view (`horizontal={true}`) you should pass only `x` (and optionally `momentumX`) option.

Each scroll interaction consists of a mandatory drag scroll part which simulates user dragging the scroll view with his finger (`y` or `x` option). This may optionally be followed by a momentum scroll movement which simulates the inertial movement of scroll view content after the user lifts his finger up (`momentumY` or `momentumX` options).

### Options {#scroll-to-options}

- `y` - target vertical drag scroll position
- `x` - target horizontal drag scroll position
- `momentumY` - target vertical momentum scroll position
- `momentumX` - target horizontal momentum scroll position
- `contentSize` - passed to `ScrollView` events and enabling `FlatList` updates
- `layoutMeasurement` - passed to `ScrollView` events and enabling `FlatList` updates

User Event will generate a number of intermediate scroll steps to simulate user scroll interaction. You should not rely on exact number or values of these scrolls steps as they might be change in the future version.

This function will remember where the last scroll ended, so subsequent scroll interaction will starts from that position. The initial scroll position will be assumed to be `{ y: 0, x: 0 }`.

In order to simulate a `FlatList` (and other controls based on `VirtualizedList`) scrolling, you should pass `contentSize` and `layoutMeasurement` options, which enable the underlying logic to update the currently visible window.

### Sequence of events

The sequence of events depends whether scroll includes optional momentum scroll component.

**Drag scroll**:

- `scrollBeginDrag`
- `scroll` (multiple times)
- `scrollEndDrag`

**Momentum scroll (optional)**:

- `momentumScrollBegin`
- `scroll` (multiple events)
- `momentumScrollEnd`
