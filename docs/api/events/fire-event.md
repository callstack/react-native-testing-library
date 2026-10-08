# Fire Event API

## `fireEvent` \{#fire-event}

:::note
For common events like `press` or `type`, use the [User Event API](/react-native-testing-library/docs/api/events/user-event.md). It simulates events more realistically by emitting a sequence of events with proper event objects that mimic React Native runtime behavior.

Use Fire Event for cases not supported by User Event and for triggering event handlers on composite components.
:::

```ts
function fireEvent(instance: TestInstance, eventType: string, ...data: unknown[]): Promise<unknown>;
```

The `fireEvent` API triggers event handlers on both host and composite components. It traverses the component tree bottom-up from the passed element to find an enabled event handler named `onXxx` where `xxx` is the event name.

Some events are direct in React Native: they are delivered only to the host element that emitted them. `fireEvent` still bubbles them for backward compatibility, but logs a warning when they bubble from a nested element to the handler of an ancestor that emits them, e.g. `scroll` from `ScrollView` content to the `ScrollView`. They will stop bubbling in the next major version, so fire them on the element that has the handler. These events are:

- `layout`, `accessibilityAction`, `accessibilityTap`, `magicTap` and `accessibilityEscape` on all elements
- `textLayout` on `Text`
- `scroll`, `selectionChange` and `contentSizeChange` on `TextInput`
- `loadStart`, `progress`, `partialLoad`, `load`, `error` and `loadEnd` on `Image`
- `scroll`, `scrollBeginDrag`, `scrollEndDrag`, `momentumScrollBegin`, `momentumScrollEnd`, `scrollToTop`, `refresh` and `contentSizeChange` on `ScrollView`
- `requestClose`, `show`, `dismiss` and `orientationChange` on `Modal`

Events with these names bubble without a warning to other handlers, such as an `onLoad` prop of your own composite component.

Unlike User Event, this API does not automatically pass event object to event handler, this is responsibility of the user to construct such object.

The base `fireEvent(instance, eventType, ...data)` API can pass multiple custom arguments to the handler. Convenience helpers such as `fireEvent.press` and `fireEvent.scroll` are different: they create a default event object and accept one optional object to merge into it.

This function uses async `act` internally to execute all pending React updates during event handling.

```jsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('fire changeText event', async () => {
  const onEventMock = jest.fn();
  await render(
    // MyComponent renders TextInput which has a placeholder 'Enter details'
    // and with `onChangeText` bound to handleChangeText
    <MyComponent handleChangeText={onEventMock} />,
  );

  await fireEvent(screen.getByPlaceholderText('change'), 'onChangeText', 'ab');
  expect(onEventMock).toHaveBeenCalledWith('ab');
});
```

:::note
`fireEvent` performs checks that should prevent events firing on disabled elements.
:::

An example using `fireEvent` with native events that aren't already aliased by the `fireEvent` api.

```jsx
import { TextInput, View } from 'react-native';
import { fireEvent, render, screen } from '@testing-library/react-native';

const onBlurMock = jest.fn();

await render(
  <View>
    <TextInput placeholder="my placeholder" onBlur={onBlurMock} />
  </View>,
);

// you can omit the `on` prefix
await fireEvent(screen.getByPlaceholderText('my placeholder'), 'blur');
```

FireEvent exposes convenience methods for common events like: `press`, `changeText`, `scroll`, `layout`.

### `fireEvent.press` \{#press}

:::note
Use the User Event [`press()`](/react-native-testing-library/docs/api/events/user-event.md#press) helper instead. It simulates press interactions more realistically, including pressable support.
:::

```tsx
fireEvent.press: (
  instance: TestInstance,
  eventProps?: Record<string, unknown>,
) => Promise<void>
```

Builds a press event object, merges `eventProps` into it, and invokes the `press` handler on the element or nearest eligible parent.

```jsx
import { View, Text, TouchableOpacity } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onPressMock = jest.fn();
const eventData = {
  nativeEvent: {
    pageX: 20,
    pageY: 30,
  },
};

await render(
  <View>
    <TouchableOpacity onPress={onPressMock}>
      <Text>Press me</Text>
    </TouchableOpacity>
  </View>,
);

await fireEvent.press(screen.getByText('Press me'), eventData);
expect(onPressMock).toHaveBeenCalledWith(expect.objectContaining(eventData));
```

### `fireEvent.changeText` \{#change-text}

:::note
Use the User Event [`type()`](/react-native-testing-library/docs/api/events/user-event.md#type) helper instead. It simulates text change interactions more realistically, including key-by-key typing, element focus, and other editing events.
:::

```tsx
fireEvent.changeText: (
  instance: TestInstance,
  text: string,
) => Promise<void>
```

Invokes `changeText` event handler on the element or parent element in the tree.

```jsx
import { View, TextInput } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onChangeTextMock = jest.fn();
const CHANGE_TEXT = 'content';

await render(
  <View>
    <TextInput placeholder="Enter data" onChangeText={onChangeTextMock} />
  </View>,
);

await fireEvent.changeText(screen.getByPlaceholderText('Enter data'), CHANGE_TEXT);
```

### `fireEvent.scroll` \{#scroll}

:::note
Prefer [`user.scrollTo`](/react-native-testing-library/docs/api/events/user-event.md#scrollto) over `fireEvent.scroll` for `ScrollView`, `FlatList`, and `SectionList` components. User Event simulates events more realistically based on React Native runtime behavior.
:::

```tsx
fireEvent.scroll: (
  instance: TestInstance,
  eventProps?: Record<string, unknown>,
) => Promise<void>
```

Builds a scroll event object, merges `eventProps` into it, and invokes the `scroll` handler on the element or nearest eligible parent.

The scroll event will include the layout size from the most recent [`fireEvent.layout()`](#layout) call on the same `ScrollView` as its `layoutMeasurement`, unless you pass one in `eventProps`.

#### On a `ScrollView`

```jsx
import { ScrollView, Text } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onScrollMock = jest.fn();
const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 200,
    },
  },
};

await render(
  <ScrollView testID="scroll-view" onScroll={onScrollMock}>
    <Text>Content</Text>
  </ScrollView>,
);

await fireEvent.scroll(screen.getByTestId('scroll-view'), eventData);
```

### `fireEvent.layout` \{#layout}

:::note
Available since React Native Testing Library 14.1.0.
:::

```tsx
fireEvent.layout: (
  instance: TestInstance,
  layout?: Partial<{ x: number; y: number; width: number; height: number }>,
) => Promise<void>
```

Builds a layout event carrying the given `layout` rectangle and invokes the `onLayout` handler of the given element. Use it to simulate the layout engine measuring an element, e.g. to test components that adapt to a measured size.

Layout events fired with this helper do not bubble: React Native delivers them only to the measured element, so only that element's own `onLayout` prop is called, not handlers on its parent elements or composite components. This is the intended behavior. `fireEvent(element, 'layout')` still bubbles for backward compatibility, with a deprecation warning, and will stop bubbling like `fireEvent.layout()` in the next major version.

The `layout` values are merged onto a zeroed rectangle (`{ x: 0, y: 0, width: 0, height: 0 }`), so pass only the fields your component reads.

The element's layout size is remembered, so later [scroll events](#scroll) and [`userEvent.scrollTo()`](/react-native-testing-library/docs/api/events/user-event.md#scroll-to) calls on the same `ScrollView` use it as their `layoutMeasurement`.

```jsx
import { View } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onLayoutMock = jest.fn();

await render(<View testID="box" onLayout={onLayoutMock} />);

await fireEvent.layout(screen.getByTestId('box'), { width: 320, height: 80 });
```
