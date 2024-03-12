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

![Version][version-badge]
![codecov][codecov-badge]
![Build](https://github.com/callstack/react-native-testing-library/actions/workflows/main.yml/badge.svg)
[![downloads](https://img.shields.io/npm/dm/@testing-library/react-native.svg?style=flat-square)](http://www.npmtrends.com/@testing-library/react-native)
![PRs Welcome][prs-welcome-badge]
[![Chat][chat-badge]][chat]
![Sponsored by Callstack][callstack-badge]
[![Star on GitHub](https://img.shields.io/github/stars/callstack/react-native-testing-library.svg?style=social)](https://github.com/callstack/react-native-testing-library/stargazers)

## The problem

You want to write maintainable tests for your React Native components. As a part of this goal, you want your tests to avoid including implementation details of your components and rather focus on making your tests give you the confidence for which they are intended. As part of this, you want your tests to be maintainable in the long run so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

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

This library has a `peerDependencies` listing for `react-test-renderer`. Make sure that your `react-test-renderer` version matches exactly the `react` version.

### Additional Jest matchers

You can use the built-in Jest matchers by adding the following line to your `jest-setup.ts` file (configured using [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array)):

```ts
import '@testing-library/react-native/extend-expect';
```

### Custom Jest Preset (React Native before 0.71)

We generally advise using the "react-native" preset when testing with this library.

However, if you use React Native version earlier than 0.71 with [modern Jest fake timers](https://jestjs.io/blog/2020/05/05/jest-26#new-fake-timers) (default since Jest 27), you'll need to apply this custom Jest preset or otherwise awaiting promises, like using `waitFor` or `findBy*`, queries will fail with a timeout.

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
import { render, screen, fireEvent } from '@testing-library/react-native';
import { QuestionsBoard } from '../QuestionsBoard';

// It is recommended to use userEvent with fake timers
// Some events involve duration so your tests may take a long time to run.
jest.useFakeTimers();

test('form submits two answers', async () => {
  const questions = ['q1', 'q2'];
  const onSubmit = jest.fn();

  const user = userEvent.setup();
  render(<QuestionsBoard questions={questions} onSubmit={onSubmit} />);

  const answerInputs = screen.getAllByLabelText('answer input');

  // simulates the user focusing on TextInput and typing text one char at a time
  await user.type(answerInputs[0], 'a1');
  await user.type(answerInputs[1], 'a2');

  // simulates the user pressing on any pressable element
  await user.press(screen.getByRole('button', { name: 'Submit' }));

  expect(onSubmit).toHaveBeenCalledWith({
    1: { q: 'q1', a: 'a1' },
    2: { q: 'q2', a: 'a2' },
  });
});
```

You can find the source of `QuestionsBoard` component and this example [here](https://github.com/callstack/react-native-testing-library/blob/main/src/__tests__/questionsBoard.test.tsx).

## API / Usage

The [public API](https://callstack.github.io/react-native-testing-library/docs/api) of `@testing-library/react-native` is focused around these essential methods:

- [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render) – deeply renders the given React element and returns helpers to query the output components.
- [`fireEvent`](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) - invokes named event handler on the element.
- [`waitFor`](https://callstack.github.io/react-native-testing-library/docs/api#waitfor) - waits for non-deterministic periods of time until the queried element is added or times out.
- [`waitForElementToBeRemoved`](https://callstack.github.io/react-native-testing-library/docs/api#waitforelementtoberemoved) - waits for non-deterministic periods of time until the queried element is removed or times out.
- [`within`](https://callstack.github.io/react-native-testing-library/docs/api#within) - creates a queries object scoped for a given element.

## Migration Guides

- [Migration to 12.0](https://callstack.github.io/react-native-testing-library/docs/migration-v12)
- [Migration to 11.0](https://callstack.github.io/react-native-testing-library/docs/migration-v11)
- [Migration to 9.0](https://callstack.github.io/react-native-testing-library/docs/migration-v9)
- [Migration to 7.0](https://callstack.github.io/react-native-testing-library/docs/migration-v7)
- [Migration to 2.0](https://callstack.github.io/react-native-testing-library/docs/migration-v2)

## Troubleshooting

- [Troubleshooting guide](https://callstack.github.io/react-native-testing-library/docs/troubleshooting)

## Community Resources

Check out our list of [Community Resources about RNTL](https://callstack.github.io/react-native-testing-library/docs/community-resources).

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
[codecov-badge]: https://codecov.io/gh/callstack/react-native-testing-library/branch/main/graph/badge.svg?token=tYVSWro1IP
[codecov]: https://codecov.io/gh/callstack/react-native-testing-library
