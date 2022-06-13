<div align='center'>
  <h1>React Native Testing Library</h1>
  <img
    height="80"
    width="80"
    alt="owl"
    src="https://raw.githubusercontent.com/callstack/react-native-testing-library/main/website/static/img/owl.png"
  />
  <p>Simple and complete React Native testing utilities that encourage good testing practices.</P>
</div>

[![Version][version-badge]][package]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![Chat][chat-badge]][chat]
[![Sponsored by Callstack][callstack-badge]][callstack]

> We renamed the `react-native-testing-library` npm package to `@testing-library/react-native`, officially joining the "Testing Library" family 🎉. Read the [migration guide](https://callstack.github.io/react-native-testing-library/docs/migration-v7).

## The problem

You want to write maintainable tests for your React Native components. As a part of this goal, you want your tests to avoid including implementation details of your components and rather focus on making your tests give you the confidence for which they are intended. As part of this, you want your testbase to be maintainable in the long run so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

## This solution

The React Native Testing Library (RNTL) is a lightweight solution for testing React Native components. It provides light utility functions on top of `react-test-renderer`, in a way that encourages better testing practices. Its primary guiding principle is:

> The more your tests resemble the way your software is used, the more confidence they can give you.

This project is inspired by [React Testing Library](https://github.com/testing-library/react-testing-library). Tested to work with Jest, but it should work with other test runners as well.

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

This library has a peerDependencies listing for `react-test-renderer` and, of course, `react`. Make sure to install them too!

> In order to properly use helpers for async tests (`findBy` queries and `waitFor`) you need at least React >=16.9.0 (featuring async `act`) or React Native >=0.61 (which comes with React >=16.9.0).

### Additional Jest matchers

In order to use additional React Native-specific jest matchers from [@testing-library/jest-native](https://github.com/testing-library/jest-native) package add it to your project:

#### Using `yarn`

```sh
yarn add --dev @testing-library/jest-native
```

#### Using `npm`

```sh
npm install --save-dev @testing-library/jest-native
```

Then automatically add it to your jest tests by using `setupFilesAfterEnv` option in your Jest configuration (it's usually located either in `package.json` under `"jest"` key or in a `jest.config.json` file):

```json
{
  "preset": "react-native",
  "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"]
}
```

### Custom Jest Preset

> **important** if you use "modern" Fake Timers

We generally advise to use the "react-native" preset when testing with this library. However, if you use ["modern" Fake Timers](https://jestjs.io/blog/2020/05/05/jest-26#new-fake-timers) (default since Jest 27), you'll need to apply our custom Jest preset or awaiting promises, like `waitFor`, will timeout.

This is a [known issue](https://github.com/facebook/react-native/issues/29303). It happens because React Native's Jest preset overrides native Promise. Our preset restores it to defaults, which is not a problem in most apps out there.

Here's how you apply a custom preset in your Jest config:

```json
{
  "preset": "@testing-library/react-native"
}
```

If this doesn't work for you, please fall back to using "legacy" fake timers.

### Flow

Note for [Flow](https://flow.org) users – you'll also need to install typings for `react-test-renderer`:

```sh
flow-typed install react-test-renderer
```

## Example

```jsx
import { render, fireEvent } from '@testing-library/react-native';
import { QuestionsBoard } from '../QuestionsBoard';

test('form submits two answers', () => {
  const allQuestions = ['q1', 'q2'];
  const mockFn = jest.fn();

  const { getAllByLabelText, getByText } = render(
    <QuestionsBoard questions={allQuestions} onSubmit={mockFn} />
  );

  const answerInputs = getAllByLabelText('answer input');

  fireEvent.changeText(answerInputs[0], 'a1');
  fireEvent.changeText(answerInputs[1], 'a2');
  fireEvent.press(getByText('Submit'));

  expect(mockFn).toBeCalledWith({
    '1': { q: 'q1', a: 'a1' },
    '2': { q: 'q2', a: 'a2' },
  });
});
```

You can find the source of `QuestionsBoard` component and this example [here](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/questionsBoard.test.js).

## API / Usage

The [public API](https://callstack.github.io/react-native-testing-library/docs/api) of `@testing-library/react-native` is focused around these essential methods:

- [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render) – deeply renders given React element and returns helpers to query the output components.
- [`fireEvent`](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) - invokes named event handler on the element.
- [`waitFor`](https://callstack.github.io/react-native-testing-library/docs/api#waitfor) - waits for non-deterministic periods of time until queried element is added or times out.
- [`waitForElementToBeRemoved`](https://callstack.github.io/react-native-testing-library/docs/api#waitforelementtoberemoved) - waits for non-deterministic periods of time until queried element is removed or times out.
- [`within`](https://callstack.github.io/react-native-testing-library/docs/api#within) - creates a queries object scoped for given element.

## Migration Guides

- [Migration to 7.0](https://callstack.github.io/react-native-testing-library/docs/migration-v7)
- [Migration to 2.0](https://callstack.github.io/react-native-testing-library/docs/migration-v2)

## Related External Resources

- [Real world extensive examples repo](https://github.com/vanGalilea/react-native-testing)
- [Where and how to start testing 🧪 your react-native app ⚛️ and how to keep on testin’](https://blog.usejournal.com/where-and-how-to-start-testing-your-react-native-app-%EF%B8%8F-and-how-to-keep-on-testin-ec3464fb9b41)
- [Intro to React Native Testing Library & Jest Native](https://youtu.be/CpTQb0XWlRc)

## Made with ❤️ at Callstack

React Native Testing Library is an open source project and will always remain free to use. If you think it's cool, please star it 🌟. [Callstack](https://callstack.com) is a group of React and React Native geeks, contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need any help with these or just want to say hi!

Like the project? ⚛️ [Join the team](https://callstack.com/careers/?utm_campaign=Senior_RN&utm_source=github&utm_medium=readme) who does amazing stuff for clients and drives React Native Open Source! 🔥

---

Supported and used by [Rally Health](https://www.rallyhealth.com/careers-home).

<!-- badges -->

[version-badge]: https://img.shields.io/npm/v/@testing-library/react-native.svg?style=flat-square
[package]: https://www.npmjs.com/package/@testing-library/react-native
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[chat-badge]: https://img.shields.io/discord/426714625279524876.svg?style=flat-square&colorB=758ED3
[chat]: https://discord.gg/QbGezWe
[callstack-badge]: https://callstack.com/images/callstack-badge.svg
[callstack]: https://callstack.com/open-source/?utm_source=github.com&utm_medium=referral&utm_campaign=react-native-testing-library&utm_term=readme
