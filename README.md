# react-native-testing-library

Simple React Native testing utilities helping you write better tests with less effort

[![Build Status][build-badge]][build]
[![Version][version-badge]][package]
[![MIT License][license-badge]][license]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![Chat][chat-badge]][chat]
[![Greenkeeper badge][greenkeeper-badge]][greenkeeper]

_Appreciation notice: This project is heavily inspired by [react-testing-library](https://github.com/kentcdodds/react-testing-library). Go check it out and use it to test your web React apps._

## The problem

You want to write maintainable tests for your React Native components without testing implementation details, but then you're told to use Enzyme, which you learn has no React Native adapter, meaning only shallow rendering is supported. And you want to render deep! But deep rendering may otherwise require jsdom (React Native isn't the web!), while doing deep rendering with `react-test-renderer` is so painful.

You would also like to use the newest React features, but you need to wait for your testing library's abstractions to catch up and it takes a while.

You finally want to approach testing using only best practices, while Enzyme may encourage assertions on implementation details.

## This solution

The `react-native-testing-library` is a lightweight solution for testing your React Native components. It provides light utility functions on top of `react-test-renderer` letting you always be up to date with latest React features and write any component tests you like, be it shallow or deeply rendered ones. But really not any, it prevents you from testing implementation details because we stand this is a very bad practice.

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/).

## Example

```jsx
import { render, fireEvent } from 'react-native-testing-library';
import { QuestionsBoard } from '../QuestionsBoard';

function setAnswer(question, answer) {
  fireEvent.changeText(question, answer);
}

test('should verify two questions', () => {
  const { getAllByName, getByText } = render(<QuestionsBoard {...props} />);
  const allQuestions = getAllByName('Question');

  setAnswer(allQuestions[0], 'a1');
  setAnswer(allQuestions[1], 'a2');

  fireEvent.press(getByText('submit'));

  expect(props.verifyQuestions).toBeCalledWith({
    '1': { q: 'q1', a: 'a1' },
    '2': { q: 'q2', a: 'a2' },
  });
});
```

## Installation

Open a Terminal in your project's folder and run:

```sh
yarn add --dev react-native-testing-library
```

This library has a peerDependencies listing for `react-test-renderer` and, of course, `react`. Make sure to install them too!

As you may have noticed, it's not tied to React Native at all – you can safely use it in your React components if you feel like not interacting directly with DOM.

## Usage

## `render`

Defined as:

```jsx
function render(
  component: React.Element<*>,
  options?: {
    /* You won't often use this, but it's helpful when testing refs */
    createNodeMock: (element: React.Element<*>) => any,
  }
): RenderResult {}
```

Deeply render given React element and returns helpers to query the output.

```jsx
import { render } from 'react-native-testing-library';

const { getByTestId, getByName /*...*/ } = render(<Component />);
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

### `getByName: (name: string | React.ComponentType<*>)`

A method returning a `ReactTestInstance` with matching name – may be a string or React Element. Throws when no matches.

### `getAllByName: (name: string | React.ComponentType<*>)`

A method returning an array of `ReactTestInstance`s with matching name – may be a string or React Element.

### `getByText: (text: string | RegExp)`

A method returning a `ReactTestInstance` with matching text – may be a string or regular expression. Throws when no matches.

### `getAllByText: (text: string | RegExp)`

A method returning an array of `ReactTestInstance`s with matching text – may be a string or regular expression.

### `getByProps: (props: { [propName: string]: any })`

A method returning a `ReactTestInstance` with matching props object. Throws when no matches.

### `getAllByProps: (props: { [propName: string]: any })`

A method returning an array of `ReactTestInstance`s with matching props object.

### `update: (element: React.Element<*>) => void`

Re-render the in-memory tree with a new root element. This simulates a React update at the root. If the new element has the same type and key as the previous element, the tree will be updated; otherwise, it will re-mount a new tree.

### `unmount: () => void`

Unmount the in-memory tree, triggering the appropriate lifecycle events

When using React context providers, like Redux Provider, you'll likely want to wrap rendered component with them. In such cases it's convenient to create your custom `render` method. [Follow this great guide on how to set this up](https://github.com/kentcdodds/react-testing-library#custom-render).

### `toJSON: () => ?ReactTestRendererJSON`

Get the rendered component JSON representation, e.g. for snapshot testing.

## `shallow`

Shallowly render given React component. Since it doesn't return helpers to query the output, it's mostly advised to used for snapshot testing (short snapshots are best for code reviewers).

```jsx
import { shallow } from 'react-native-testing-library';

test('Component has a structure', () => {
  const { output } = shallow(<Component />);
  expect(output).toMatchSnapshot();
});
```

## `FireEvent API`

### `fireEvent: (element: ReactTestInstance, eventName: string, data?: *) => void`

Invokes named event handler on the element or parent element in the tree.

```jsx
import { View } from 'react-native';
import { render, fireEvent } from 'react-native-testing-library';
import { MyComponent } from './MyComponent';

const onEventMock = jest.fn();
const { getByTestId } = render(
  <MyComponent testID="custom" onMyCustomEvent={onEventMock} />
);

fireEvent(getByTestId('custom'), 'myCustomEvent');
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

Defined as:

```jsx
function waitForExpect<T: *>(
  expectation: () => T,
  timeout: number = 4500,
  interval: number = 50
): Promise<T> {}
```

Wait for non-deterministic periods of time until your element appears or times out. `waitForExpect` periodically calls `expectation` every `interval` milliseconds to determine whether the element appeared or not.

```jsx
import { render, waitForElement } from 'react-testing-library';

test('waiting for an Banana to be ready', async () => {
  const { getByText } = render(<Banana />);

  await waitForElement(() => getByText('Banana ready'));
});
```

If you're using Jest's [Timer Mocks](https://jestjs.io/docs/en/timer-mocks#docsNav), remember not to use `async/await` syntax as it will stall your tests.

## `debug`

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

Wait for microtasks queue to flush. Useful if you want to wait for some promises with `async/await`.

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

<!-- badges -->

[build-badge]: https://img.shields.io/circleci/project/github/callstack/react-native-testing-library/master.svg?style=flat-square
[build]: https://circleci.com/gh/callstack/react-native-testing-library
[version-badge]: https://img.shields.io/npm/v/react-native-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-testing-library
[license-badge]: https://img.shields.io/npm/l/react-native-testing-library.svg?style=flat-square
[license]: https://opensource.org/licenses/MIT
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[chat-badge]: https://img.shields.io/discord/426714625279524876.svg?style=flat-square&colorB=758ED3
[chat]: https://discord.gg/QbGezWe
[greenkeeper-badge]: https://badges.greenkeeper.io/callstack/react-native-testing-library.svg?style=flat-square
[greenkeeper]: https://greenkeeper.io/
