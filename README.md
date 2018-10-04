# react-native-testing-library

Simple React Native testing utilities helping you write better tests with less effort

_Appreciation notice: This project is heavily inspired by [react-testing-library](https://github.com/kentcdodds/react-testing-library). Go check it out and use it to test your web React apps._

## The problem

You want to write maintainable tests for your React Native components without testing implementation details, but then you're told to use Enzyme, which only supports shallow rendering in React Native environment. And you want to render deep! But doing so with `react-test-renderer` is so painful.

You would also like to use the newest React features, but you need to wait for your testing library's abstractions to catch up and it takes a while.

## This solution

The `react-native-testing-library` is a lightweight solution for testing your React Native components. It provides light utility functions on top of `react-test-renderer` letting you always be up to date with latest React features and write any component tests you like, be it shallow or deeply rendered ones. But really not any, it prevents you from testing implementation details because we stand this is a very bad practice.

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/).

## Example

```jsx
import { render } from 'react-native-testing-library';
import { QuestionsBoard } from '../QuestionsBoard';

function setAnswer(question, answer) {
  question.props.onChangeText(answer);
}

test('should verify two questions', () => {
  const { getAllByName, getByText } = render(<QuestionsBoard {...props} />);
  const allQuestions = getAllByName('Question');

  setAnswer(allQuestions[0], 'a1');
  setAnswer(allQuestions[1], 'a2');

  getByText('submit').props.onPress();

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

This library has a peerDependencies listing for `react-test-renderer`, `pretty-format` and, of course, `react`. Make sure to install them too!

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

Deeply render given React element and returns helpers to query the output. For convenience it also returns `react-test-renderer`'s `instance` and `renderer` objects, in case you need more control.

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

### `getByName: (name: string | React.Element<*>)`

A method returning a `ReactTestInstance` with matching name – may be a string or React Element. Throws when no matches.

### `getAllByName: (name: string | React.Element<*>)`

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

## `shallow`

Shallowly render given React copmonent. Since it doesn't return helpers to query the output, it's mostly adviced to used for snapshot testing (short snapshots are best for code reviewers).

```jsx
import { shallow } from 'react-native-testing-library';

test('Component has a structure', () => {
  const { output } = shallow(<Component />);
  expect(output).toMatchSnapshot();
});
```

## `debug`

Log prettified shallowly rendered component or test instance (just like snapshot) to stdout.

```jsx
import { debug } from 'react-native-testing-library';

debug(<Component />);
// console.log:
// <View>
//   <Text>Component</Text>
// </View>
```

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
