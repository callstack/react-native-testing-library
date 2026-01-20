# Introduction

## The problem

You want to write maintainable tests for your React Native components. Your tests should avoid implementation details and focus on giving you confidence that your components work correctly. Tests should also be maintainable so refactors (changes to implementation but not functionality) don't break your tests and slow you and your team down.

## This solution

The React Native Testing Library (RNTL) is a lightweight solution for testing React Native components. It provides light utility functions on top of React Test Renderer, in a way that encourages better testing practices. Its primary guiding principle is:

> The more your tests resemble how your software is used, the more confidence they can give you.

This project is inspired by [React Testing Library](https://github.com/testing-library/react-testing-library). It is tested to work with Jest, but it should work with other test runners as well.

## Example

```jsx
import { render, screen, userEvent } from '@testing-library/react-native';
import { QuestionsBoard } from '../QuestionsBoard';

test('form submits two answers', async () => {
  const questions = ['q1', 'q2'];
  const onSubmit = jest.fn();

  const user = userEvent.setup();
  render(<QuestionsBoard questions={questions} onSubmit={onSubmit} />);

  const answerInputs = screen.getAllByLabelText('answer input');
  await user.type(answerInputs[0], 'a1');
  await user.type(answerInputs[1], 'a2');
  await user.press(screen.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledWith({
    1: { q: 'q1', a: 'a1' },
    2: { q: 'q2', a: 'a2' },
  });
});
```

You can find the source of the `QuestionsBoard` component and this example [here](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/questionsBoard.test.tsx).
