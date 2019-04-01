---
id: api
title: API
---

This page gathers public API of `react-native-testing-library` along with usage examples.

## `render` 

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/render.test.js)

Defined as:

```jsx
function render(
  component: React.Element<any>,
  options?: {
    /* You won't often use this, but it's helpful when testing refs */
    createNodeMock: (element: React.Element<any>) => any,
  }
): RenderResult {}
```

Deeply renders given React element and returns helpers to query the output components structure.

```jsx
import { render } from 'react-native-testing-library';

const { getByTestId, getByText /*...*/ } = render(<Component />);
```

Returns a `RenderResult` object with following properties:

### `getByTestId: (testID: string)`

A method returning a `ReactTestInstance` with matching `testID` prop. Throws when no matches.

_Note: most methods like this one return a [`ReactTestInstance`](https://reactjs.org/docs/test-renderer.html#testinstance) with following properties that you may be interested in:_

```jsx
type ReactTestInstance = {
  type: string | Function,
  props: { [propName: string]: any },
  parent: null | ReactTestInstance,
  children: Array<ReactTestInstance | string>,
};
```

### `getByText: (text: string | RegExp)`

A method returning a `ReactTestInstance` with matching text – may be a string or regular expression. Throws when no matches.

This method will join `<Text>` siblings to find matches, similarly to [how React Native handles these components](https://facebook.github.io/react-native/docs/text#containers). This will allow for querying for strings that will be visually rendered together, but may be semantically separate React components.

### `getAllByText: (text: string | RegExp)`

A method returning an array of `ReactTestInstance`s with matching text – may be a string or regular expression.

### `getByPlaceholder: (placeholder: string | RegExp)`

A method returning a `ReactTestInstance` for a `TextInput` with a matching placeholder – may be a string or regular expression. Throws when no matches.

### `getAllByPlaceholder: (placeholder: string | RegExp)`

A method returning an array of `ReactTestInstance`s for `TextInput`'s with a matching placeholder – may be a string or regular expression.

### `getByProps: (props: { [propName: string]: any })`

A method returning a `ReactTestInstance` with matching props object. Throws when no matches.

### `getAllByProps: (props: { [propName: string]: any })`

A method returning an array of `ReactTestInstance`s with matching props object.

### `getByType: (type: React.ComponentType<*>)`

> Note: added in v1.4

A method returning a `ReactTestInstance` with matching a React component type. Throws when no matches.

### `getAllByType: (type: React.ComponentType<*>)`

> Note: added in v1.4

A method returning an array of `ReactTestInstance`s with matching a React component type.

### `[DEPRECATED] getByName: (name: React.ComponentType<*>)`

A method returning a `ReactTestInstance` with matching a React component type. Throws when no matches.

> This method has been **deprecated** because using it results in fragile tests that may break between minor React Native versions. It will be removed in next major release (v2.0). Use [`getByType`](#getbytype-type-reactcomponenttype) instead.

### `[DEPRECATED] getAllByName: (name: React.ComponentType<*>)`

A method returning an array of `ReactTestInstance`s with matching a React component type.

> This method has been **deprecated** because using it results in fragile tests that may break between minor React Native versions. It will be removed in next major release (v2.0). Use [`getAllByType`](#getallbytype-type-reactcomponenttype) instead.

### `update: (element: React.Element<any>) => void`

Re-render the in-memory tree with a new root element. This simulates a React update at the root. If the new element has the same type and key as the previous element, the tree will be updated; otherwise, it will re-mount a new tree. This is useful when testing for `componentDidUpdate` behavior, by passing updated props to the component.

[Example code](https://github.com/callstack/react-native-testing-library/blob/f96d782d26dd4815dbfd01de6ef7a647efd1f693/src/__tests__/act.test.js#L31-L37)

### `unmount: () => void`

Unmount the in-memory tree, triggering the appropriate lifecycle events

When using React context providers, like Redux Provider, you'll likely want to wrap rendered component with them. In such cases it's convenient to create your custom `render` method. [Follow this great guide on how to set this up](https://github.com/kentcdodds/react-testing-library#custom-render).

### `debug: (message?: string) => void`

Prints deeply rendered component passed to `render` with optional message on top. Uses [debug.deep](#debug) under the hood, but it's easier to use.

```jsx
const { debug } = render(<Component />);

debug('optional message');
```

logs optional message and colored JSX:

```jsx
optional message

<TouchableOpacity
  activeOpacity={0.2}
  onPress={[Function bound fn]}
>
  <Text>Press me</Text>
</TouchableOpacity>
```

### `debug.shallow: (message?: string) => void`

Prints shallowly rendered component passed to `render` with optional message on top. Uses [debug.shallow](#debug) under the hood, but it's easier to use.

### `toJSON: () => ?ReactTestRendererJSON`

Get the rendered component JSON representation, e.g. for snapshot testing.

## `shallow`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/shallow.test.js)

Shallowly renders given React component.

```jsx
import { shallow } from 'react-native-testing-library';

test('Component has a structure', () => {
  const { output } = shallow(<Component />);
  expect(output).toMatchSnapshot();
});
```

## `fireEvent`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/fireEvent.test.js)

Invokes a given event handler (whether native or custom) on the element, bubbling to the root of the rendered tree. The three most common events (`press`, `changeText`, and `scroll`) have been aliased for convenience.

### `fireEvent: (element: ReactTestInstance, eventName: string, data?: *) => void`

Invokes named event handler on the element or parent element in the tree. For better readability, `fireEvent` strips the `on` part of the handler prop name, so it will fire `onMyCustomEvent` when `myCustomEvent` is passed as `eventName`.

```jsx
import { render, fireEvent } from 'react-native-testing-library';
import { MyComponent } from './MyComponent';

const onEventMock = jest.fn();
const { getByTestId } = render(
  <MyComponent testID="custom" onMyCustomEvent={onEventMock} />
);

fireEvent(getByTestId('custom'), 'myCustomEvent');
```

An example using `fireEvent` with native events that aren't already aliased by the `fireEvent` api.

```jsx
import { TextInput, View } from 'react-native';
import { fireEvent, render } from 'react-native-testing-library';

const onBlurMock = jest.fn();

const { getByPlaceholder } = render(
  <View>
    <TextInput placeholder="my placeholder" onBlur={onBlurMock} />
  </View>
);

fireEvent(getByPlaceholder('my placeholder'), 'blur');
```

### `fireEvent.press: (element: ReactTestInstance) => void`

Invokes `press` event handler on the element or parent element in the tree.

```jsx
import { View, Text, TouchableOpacity } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onPressMock = jest.fn();

const { getByTestId } = render(
  <View>
    <TouchableOpacity onPress={onPressMock} testID="button">
      <Text>Press me</Text>
    </TouchableOpacity>
  </View>
);

fireEvent.press(getByTestId('button'));
```

### `fireEvent.changeText: (element: ReactTestInstance, data?: *) => void`

Invokes `changeText` event handler on the element or parent element in the tree.

```jsx
import { View, TextInput } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onChangeTextMock = jest.fn();
const CHANGE_TEXT = 'content';

const { getByTestId } = render(
  <View>
    <TextInput testID="text-input" onChangeText={onChangeTextMock} />
  </View>
);

fireEvent.changeText(getByTestId('text-input'), CHANGE_TEXT);
```

### `fireEvent.scroll: (element: ReactTestInstance, data?: *) => void`

Invokes `scroll` event handler on the element or parent element in the tree.

```jsx
import { ScrollView, TextInput } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';

const onScrollMock = jest.fn();
const eventData = {
  nativeEvent: {
    contentOffset: {
      y: 200,
    },
  },
};

const { getByTestId } = render(
  <ScrollView testID="scroll-view" onScroll={onScrollMock}>
    <Text>XD</Text>
  </ScrollView>
);

fireEvent.scroll(getByTestId('scroll-view'), eventData);
```

## `waitForElement`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/waitForElement.test.js)

Defined as:

```jsx
function waitForExpect<T: *>(
  expectation: () => T,
  timeout: number = 4500,
  interval: number = 50
): Promise<T> {}
```

Waits for non-deterministic periods of time until your element appears or times out. `waitForExpect` periodically calls `expectation` every `interval` milliseconds to determine whether the element appeared or not.

```jsx
import { render, waitForElement } from 'react-testing-library';

test('waiting for an Banana to be ready', async () => {
  const { getByText } = render(<Banana />);

  await waitForElement(() => getByText('Banana ready'));
});
```

If you're using Jest's [Timer Mocks](https://jestjs.io/docs/en/timer-mocks#docsNav), remember not to use `async/await` syntax as it will stall your tests.

## `debug`

- [`Example code`](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/debug.test.js)

Log prettified shallowly rendered component or test instance (just like snapshot) to stdout.

```jsx
import { debug } from 'react-native-testing-library';

debug(<Component />);
debug.shallow(<Component />); // an alias for `debug`
```

logs:

```jsx
<TouchableOpacity
  activeOpacity={0.2}
  onPress={[Function bound fn]}
>
  <TextComponent
    text="Press me"
  />
</TouchableOpacity>
```

There's also `debug.deep` that renders deeply to stdout.

```jsx
import { debug } from 'react-native-testing-library';

debug.deep(<Component />);
debug.deep(toJSON(), 'actually debug JSON too'); // useful when Component state changes
```

logs:

```jsx
<View
  accessible={true}
  isTVSelectable={true}
  onResponderGrant={[Function bound touchableHandleResponderGrant]}
  // ... more props
  style={
    Object {
      \\"opacity\\": 1,
    }
  }
>
  <Text>
    Press me
  </Text>
</View>
```

Optionally you can provide a string message as a second argument to `debug`, which will be displayed right after the component.

## `flushMicrotasksQueue`

Waits for microtasks queue to flush. Useful if you want to wait for some promises with `async/await`.

```jsx
import { flushMicrotasksQueue, render } from 'react-native-testing-library';

test('fetch data', async () => {
  const { getByText } = render(<FetchData />);
  getByText('fetch');
  await flushMicrotasksQueue();
  expect(getByText('fetch').props.title).toBe('loaded');
});
```

## `query` APIs

Each of the get APIs listed in the render section above have a complimentary query API. The get APIs will throw errors if a proper node cannot be found. This is normally the desired effect. However, if you want to make an assertion that an element is not present in the hierarchy, then you can use the query API instead:

```jsx
import { render } from 'react-native-testing-library';

const { queryByText } = render(<Form />);
const submitButton = queryByText('submit');
expect(submitButton).toBeNull(); // it doesn't exist
```

## `queryAll` APIs

Each of the query APIs have a corresponding queryAll version that always returns an Array of matching nodes. getAll is the same but throws when the array has a length of 0.

```jsx
import { render } from 'react-native-testing-library';

const { queryAllByText } = render(<Forms />);
const submitButtons = queryAllByText('submit');
expect(submitButtons).toHaveLength(3); // expect 3 elements
```

## `act`

Useful function to help testing components that use hooks API. By default any `render`, `update`, and `fireEvent` calls are wrapped by this function, so there is no need to wrap it manually. This method is re-exported from [`react-test-renderer`](https://github.com/facebook/react/blob/master/packages/react-test-renderer/src/ReactTestRenderer.js#L567]).
