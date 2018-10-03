# react-native-testing-library

Simple React Native testing utilities helping you write better tests with less effort

_Appreiciation notice: This project is heavily inspired by [react-testing-library](https://github.com/kentcdodds/react-testing-library). Go check it out and use it to test your web React apps._

## The problem

You want to write maintainable tests for your React Native components without testing implementation details, but then you're told to use Enzyme, which only supports shallow rendering in React Native environment. And you want to render deep! But doing so with `react-test-renderer` is so painful.

You would also like to use the newest React features, but you need to wait for your testing library's abstractions to catch up and it takes a while.

## This solution

The `react-native-testing-library` is a lightweight solution for testing your React Native components. It provides light utility functions on top of `react-test-renderer` letting you always be up to date with latest React features and write any component tests you like, be it shallow or deeply rendered ones. But really not any, it prevents you from testing implementation details because we stand this is a very bad practice.

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/).

## Example

TBD

## Installation

Open a Terminal in your project's folder and run:

```sh
yarn add --dev react-testing-library
```

This library has a peerDependencies listing for `react-test-renderer` and, of course, `react`.

## Usage

## `render`

Deeply render given React component and returns helpers to query the output. For convenience it also returns `react-test-renderer`'s `instance` and `renderer` objects, in case you need more control.

```jsx
import { render } from 'react-native-testing-library';

const { ... } = render(<Component />);
```

You'll likely want to wrap `render` with some React Context Providers, creating your custom render. [Follow this great guide on how to set this up](https://github.com/kentcdodds/react-testing-library#custom-render).

## `shallow`

Shallowly render given React copmonents. Since it (currently) doesn't return helpers to query the output, it's mostly adviced to used for snapshot testing.

```jsx
import { shallow } from 'react-native-testing-library';

test('Component has a structure', () => {
  expect(shallow(<Component />)).toMatchSnapshot();
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
