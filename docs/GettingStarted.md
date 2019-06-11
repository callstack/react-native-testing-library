---
id: getting-started
title: Getting Started
---

## The problem

You want to write maintainable tests for your React Native components without testing implementation details, but then you're told to use Enzyme, which you learn has no React Native adapter, meaning only shallow rendering is supported. And you want to render deep! But deep rendering may otherwise require jsdom (React Native isn't the web!), while doing deep rendering with `react-test-renderer` is so painful.

You would also like to use the newest React features, but you need to wait for your testing library's abstractions to catch up and it takes a while.

You finally want to approach testing using only best practices, while Enzyme may encourage assertions on implementation details.

## This solution

The `react-native-testing-library` is a lightweight solution for testing your React Native components. It provides light utility functions on top of `react-test-renderer` letting you always be up to date with latest React features and write any component tests you like. But really not any, it prevents you from testing implementation details because we stand this is a very bad practice.

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/).

## Example

```jsx
import { render, fireEvent } from 'react-native-testing-library';
import { QuestionsBoard } from '../QuestionsBoard';
import { Question } from '../Question';

function setAnswer(question, answer) {
  fireEvent.changeText(question, answer);
}

test('should verify two questions', () => {
  jest.spyOn(props, 'verifyQuestions');
  const { getAllByA11yRole, getByText } = render(<QuestionsBoard {...props} />);
  const allQuestions = getAllByA11yRole('header');

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
