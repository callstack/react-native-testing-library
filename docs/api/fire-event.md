# Fire Event API

## `fireEvent`

> [!NOTE]
> For common events like `press` or `type`, use the [User Event API](./user-event.md). It simulates events more realistically by emitting a sequence of events with proper event objects that mimic React Native runtime behavior.
>
> Use Fire Event for cases not supported by User Event and for triggering event handlers on composite components.

```ts
function fireEvent(instance: TestInstance, eventName: string, ...data: unknown[]): Promise<unknown>;
```

The `fireEvent` API triggers event handlers on both host and composite components. It traverses the component tree bottom-up from the passed element to find an enabled event handler named `onXxx` where `xxx` is the event name.

Unlike User Event, this API does not automatically pass event object to event handler, this is responsibility of the user to construct such object.

The base `fireEvent(instance, eventName, ...data)` API can pass multiple custom arguments to the handler. Convenience helpers such as `fireEvent.press` and `fireEvent.scroll` are different: they create a default event object and accept one optional object to merge into it.

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

> [!NOTE]
> `fireEvent` performs checks that should prevent events firing on disabled elements.

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

FireEvent exposes convenience methods for common events like: `press`, `changeText`, `scroll`.

### `fireEvent.press`

> [!NOTE]
> Use the User Event [`press()`](./user-event.md#press) helper instead. It simulates press interactions more realistically, including pressable support.

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

### `fireEvent.changeText`

> [!NOTE]
> Use the User Event [`type()`](./user-event.md#type) helper instead. It simulates text change interactions more realistically, including key-by-key typing, element focus, and other editing events.

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

### `fireEvent.scroll`

> [!NOTE]
> Prefer [`user.scrollTo`](./user-event.md#scrollto) over `fireEvent.scroll` for `ScrollView`, `FlatList`, and `SectionList` components. User Event simulates events more realistically based on React Native runtime behavior.

```tsx
fireEvent.scroll: (
  instance: TestInstance,
  eventProps?: Record<string, unknown>,
) => Promise<void>
```

Builds a scroll event object, merges `eventProps` into it, and invokes the `scroll` handler on the element or nearest eligible parent.

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
