---
id: getting-started
title: Getting Started
---

## The problem

You want to write maintainable tests for your React Native components. As a part of this goal, you want your tests to avoid including implementation details of your components and focus on making your tests give you the confidence they are intended. As part of this, you want your tests to be maintainable in the long run so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

## This solution

The React Native Testing Library (RNTL) is a lightweight solution for testing React Native components. It provides light utility functions on top of React Test Renderer, in a way that encourages better testing practices. Its primary guiding principle is:

> The more your tests resemble how your software is used, the more confidence they can give you.

This project is inspired by [React Testing Library](https://github.com/testing-library/react-testing-library). It is tested to work with Jest, but it should work with other test runners as well.

You can find the source of the `QuestionsBoard` component and this example [here](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/questionsBoard.test.tsx).

## Installation

Open a Terminal in your project's folder and run:

#### Using `yarn`

```sh
yarn add --dev @testing-library/react-native
```

#### Using `npm`

```sh
npm install --save-dev @testing-library/react-native
```

This library has a peer dependency for `react-test-renderer` package. Make sure that your `react-test-renderer` version matches exactly your `react` version.

:::info
To properly use helpers for async tests (`findBy` queries and `waitFor`), you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).
:::

### Additional Jest matchers

To use additional React Native-specific Jest matchers, add the following line to your `jest-setup.ts` file (configured using [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array)):

```ts
import '@testing-library/react-native/extend-expect';
```

### Flow

Note for [Flow](https://flow.org) users – you'll also need to install typings for `react-test-renderer`:

```sh
flow-typed install react-test-renderer
```

## Example

```jsx
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QuestionsBoard } from '../QuestionsBoard';

test('form submits two answers', () => {
  const allQuestions = ['q1', 'q2'];
  const mockFn = jest.fn();

  render(<QuestionsBoard questions={allQuestions} onSubmit={mockFn} />);

  const answerInputs = screen.getAllByLabelText('answer input');

  fireEvent.changeText(answerInputs[0], 'a1');
  fireEvent.changeText(answerInputs[1], 'a2');
  fireEvent.press(screen.getByText('Submit'));

  expect(mockFn).toBeCalledWith({
    1: { q: 'q1', a: 'a1' },
    2: { q: 'q2', a: 'a2' },
  });
});
```

You can find the source of the `QuestionsBoard` component and this example [here](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/questionsBoard.test.tsx).
