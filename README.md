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

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/). It is tested to work with Jest, but it should work with other test runners as well.

## Example

```jsx
import { render, fireEvent } from 'react-native-testing-library';
import { QuestionsBoard } from '../QuestionsBoard';
import { Question } from '../Question';

function setAnswer(question, answer) {
  fireEvent.changeText(question, answer);
}

test('should verify two questions', () => {
  const { getAllByType, getByText } = render(<QuestionsBoard {...props} />);
  const allQuestions = getAllByType(Question);

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

## API / Usage

The [public API](docs/API.md) of `react-native-testing-library` is focused around these essential methods:

- [`render`](docs/API.md#render) – deeply renders given React element and returns helpers to query the output components.
- [`shallow`](docs/API.md#shallow) – shallowly renders given React component. It doesn't return any helpers to query the output.
- [`fireEvent`](docs/API.md#fireevent) - invokes named event handler on the element.
- [`waitForElement`](docs/API.md#waitforelement) - waits for non-deterministic periods of time until your element appears or times out.
- [`flushMicrotasksQueue`](docs/API.md#flushmicrotasksqueue) - waits for microtasks queue to flush.

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
