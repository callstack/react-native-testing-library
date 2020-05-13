---
id: getting-started
title: Getting Started
---

## The problem

You want to write maintainable tests for your React Native components without testing implementation details, but then you're told to use Enzyme, which you learn has no React Native adapter, meaning only shallow rendering is supported. And you want to render deep! But deep rendering may otherwise require jsdom (React Native isn't the web!), while doing deep rendering with `react-test-renderer` is so painful.

You would also like to use the newest React features, but you need to wait for your testing library's abstractions to catch up and it takes a while.

You finally want to approach testing using only best practices, while Enzyme may encourage assertions on implementation details.

## This solution

The `react-native-testing-library` is a lightweight solution for testing your React Native components. It provides light utility functions on top of `react-test-renderer` letting you always be up to date with latest React features and write any component tests you like. It also prevents you from testing implementation details because we believe this is a very bad practice.

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/).

## Example

```jsx
import { render, fireEvent } from 'react-native-testing-library';
import { QuestionsBoard } from '../QuestionsBoard';

test('form submits two answers', () => {
  const allQuestions = ['q1', 'q2'];
  const mockFn = jest.fn();

  const { getAllByA11yLabel, getByText } = render(
    <QuestionsBoard questions={allQuestions} onSubmit={mockFn} />
  );

  const answerInputs = getAllByA11yLabel('answer input');

  fireEvent.changeText(answerInputs[0], 'a1');
  fireEvent.changeText(answerInputs[1], 'a2');
  fireEvent.press(getByText('Submit'));

  expect(mockFn).toBeCalledWith({
    '1': { q: 'q1', a: 'a1' },
    '2': { q: 'q2', a: 'a2' },
  });
});
```

You can find the source of `QuestionsBoard` component and this example [here](https://github.com/callstack/react-native-testing-library/blob/master/src/__tests__/questionsBoard.test.js).

## Installation

Open a Terminal in your project's folder and run:

```sh
yarn add --dev react-native-testing-library
```

This library has a peerDependencies listing for `react-test-renderer` and, of course, `react`. Make sure to install them too!

As you may have noticed, it's not tied to React Native at all – you can safely use it in your React components if you feel like not interacting directly with DOM.
