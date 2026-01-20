# Fire Event API

```ts
function fireEvent(element: ReactTestInstance, eventName: string, ...data: unknown[]): void;
```

:::note
For common events like `press` or `type` it's recommended to use [User Event API](/react-native-testing-library/12.x/docs/api/events/user-event.md) as it offers
more realistic event simulation by emitting a sequence of events with proper event objects that mimic React Native runtime behavior.

Use Fire Event for cases not supported by User Event and for triggering event handlers on composite components.
:::

The `fireEvent` API allows you to trigger all kinds of event handlers on both host and composite components. It will try to invoke a single event handler traversing the component tree bottom-up from passed element and trying to find enabled event handler named `onXxx` when `xxx` is the name of the event passed.

Unlike User Event, this API does not automatically pass event object to event handler, this is responsibility of the user to construct such object.

```jsx
import { render, screen, fireEvent } from '@testing-library/react-native';

test('fire changeText event', () => {
  const onEventMock = jest.fn();
  render(
    // MyComponent renders TextInput which has a placeholder 'Enter details'
    // and with `onChangeText` bound to handleChangeText
    <MyComponent handleChangeText={onEventMock} />
  );

  fireEvent(screen.getByPlaceholderText('change'), 'onChangeText', 'ab');
  expect(onEventMock).toHaveBeenCalledWith('ab');
});
```

:::note
Please note that from version `7.0` `fireEvent` performs checks that should prevent events firing on disabled elements.
:::

An example using `fireEvent` with native events that aren't already aliased by the `fireEvent` api.

```jsx
import { TextInput, View } from 'react-native';
import { fireEvent, render } from '@testing-library/react-native';

const onBlurMock = jest.fn();

render(
  <View>
    <TextInput placeholder="my placeholder" onBlur={onBlurMock} />
  </View>
);

// you can omit the `on` prefix
fireEvent(screen.getByPlaceholderText('my placeholder'), 'blur');
```

FireEvent exposes convenience methods for common events like: `press`, `changeText`, `scroll`.

### `fireEvent.press` \{#press}

```
fireEvent.press: (element: ReactTestInstance, ...data: Array<any>) => void
```

:::note
It is recommended to use the User Event [`press()`](/react-native-testing-library/12.x/docs/api/events/user-event.md#press) helper instead as it offers more realistic simulation of press interaction, including pressable support.
:::

Invokes `press` event handler on the element or parent element in the tree.

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

render(
  <View>
    <TouchableOpacity onPress={onPressMock}>
      <Text>Press me</Text>
    </TouchableOpacity>
  </View>
);

fireEvent.press(screen.getByText('Press me'), eventData);
expect(onPressMock).toHaveBeenCalledWith(eventData);
```

### `fireEvent.changeText` \{#change-text}

```
fireEvent.changeText: (element: ReactTestInstance, ...data: Array<any>) => void
```

:::note
It is recommended to use the User Event [`type()`](/react-native-testing-library/12.x/docs/api/events/user-event.md#type) helper instead as it offers more realistic simulation of text change interaction, including key-by-key typing, element focus, and other editing events.
:::

Invokes `changeText` event handler on the element or parent element in the tree.

```jsx
import { View, TextInput } from 'react-native';
import { render, screen, fireEvent } from '@testing-library/react-native';

const onChangeTextMock = jest.fn();
const CHANGE_TEXT = 'content';

render(
  <View>
    <TextInput placeholder="Enter data" onChangeText={onChangeTextMock} />
  </View>
);

fireEvent.changeText(screen.getByPlaceholderText('Enter data'), CHANGE_TEXT);
```

### `fireEvent.scroll` \{#scroll}

```
fireEvent.scroll: (element: ReactTestInstance, ...data: Array<any>) => void
```

Invokes `scroll` event handler on the element or parent element in the tree.

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

render(
  <ScrollView onScroll={onScrollMock}>
    <Text>XD</Text>
  </ScrollView>
);

fireEvent.scroll(screen.getByText('scroll-view'), eventData);
```

:::note

Prefer using [`user.scrollTo`](/react-native-testing-library/12.x/docs/api/events/user-event.md#scrollto) over `fireEvent.scroll` for `ScrollView`, `FlatList`, and `SectionList` components. User Event provides a more realistic event simulation based on React Native runtime behavior.

:::
