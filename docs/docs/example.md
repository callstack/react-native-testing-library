---
id: example
title: Example
---
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
