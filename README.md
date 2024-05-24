<div align='center'>
  <h1>React Native Testing Library</h1>
  <img
    height="80"
    width="80"
    alt="owl"
    src="https://raw.githubusercontent.com/callstack/react-native-testing-library/main/website/docs/public/img/owl.png"
  />
  <p>Developer-friendly and complete React Native testing utilities that encourage good testing practices.</P>
</div>

[![Version][version-badge]][package]
[![Build Status][build-badge]][build]
[![Code Coverage][coverage-badge]][coverage]
[![Downloads][downloads-badge]][downloads]
[![MIT License][license-badge]][license]
[![Sponsored by Callstack][callstack-badge]][callstack]

## The problem

You want to write maintainable tests for your React Native components. As a part of this goal, you want your tests to avoid including implementation details of your components and rather focus on making your tests give you the confidence for which they are intended. As part of this, you want your tests to be maintainable in the long run so refactors of your components (changes to implementation but not functionality) don't break your tests and slow you and your team down.

## This solution

The React Native Testing Library (RNTL) is a comprehensive solution for testing React Native components. It provides React Native runtime simulation on top of `react-test-renderer`, in a way that encourages better testing practices. Its primary guiding principle is:

> The more your tests resemble the way your software is used, the more confidence they can give you.

This project is inspired by [React Testing Library](https://github.com/testing-library/react-testing-library). Tested to work with Jest, but it should work with other test runners as well.

## Installation

Open a Terminal in your project's folder and run:

```sh
# Yarn install:
yarn add --dev @testing-library/react-native

# NPM install
npm install --save-dev @testing-library/react-native
```

This library has a `peerDependencies` listing for `react-test-renderer`. Make sure that your `react-test-renderer` version matches exactly the `react` version, avoid using `^` in version number.

### Additional Jest matchers

You can use the built-in Jest matchers by adding the following line to your `jest-setup.ts` file (configured using [`setupFilesAfterEnv`](https://jestjs.io/docs/configuration#setupfilesafterenv-array)):

```ts
import '@testing-library/react-native/extend-expect';
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

React Native Testing Library consists of following APIs:

- [`render` function](https://callstack.github.io/react-native-testing-library/docs/api/render) - render your UI components for testing purposes
- [`screen` object](https://callstack.github.io/react-native-testing-library/docs/api/screen) - access rendered UI:
  - [Queries](https://callstack.github.io/react-native-testing-library/docs/api/queries) - find rendered components by various predicates: role, text, test ids, etc
  - Lifecycle methods: [`rerender`](https://callstack.github.io/react-native-testing-library/docs/api/screen#rerender), [`unmount`](https://callstack.github.io/react-native-testing-library/docs/api/screen#unmount)
  - Helpers: [`debug`](https://callstack.github.io/react-native-testing-library/docs/api/screen#debug), [`toJSON`](https://callstack.github.io/react-native-testing-library/docs/api/screen#tojson), [`root`](https://callstack.github.io/react-native-testing-library/docs/api/screen#root)
- [Jest matchers](https://callstack.github.io/react-native-testing-library/docs/api/jest-matchers) - validate assumptions about your UI
- [User Event](https://callstack.github.io/react-native-testing-library/docs/api/events/user-event) - simulate common user interactions like [`press`](https://callstack.github.io/react-native-testing-library/docs/api/events/user-event#press) or [`type`](https://callstack.github.io/react-native-testing-library/docs/user-event#type) in a realistic way
- [Fire Event](https://callstack.github.io/react-native-testing-library/docs/api/events/fire-event) - simulate any component event in a simplified way
- [`renderHook` function](https://callstack.github.io/react-native-testing-library/docs/api/misc/render-hook) - render hooks for testing purposes
- Miscellaneous APIs:
  - [Async utils](https://callstack.github.io/react-native-testing-library/docs/api/misc/async): `findBy*` queries, `waitFor`, `waitForElementToBeRemoved`
  - [Configuration](https://callstack.github.io/react-native-testing-library/docs/api/misc/config): `configure`, `resetToDefaults`
  - [Accessibility](https://callstack.github.io/react-native-testing-library/docs/api/misc/accessibility): `isHiddenFromAccessibility`
  - [Other](https://callstack.github.io/react-native-testing-library/docs/api/misc/other): `within`, `act`, `cleanup`

## Migration Guides

- [Migration to 12.0](https://callstack.github.io/react-native-testing-library/docs/migration/v12)
- [Migration to built-in Jest Matchers](https://callstack.github.io/react-native-testing-library/docs/migration/jest-matchers)


## Troubleshooting

- [Troubleshooting guide](https://callstack.github.io/react-native-testing-library/docs/guides/troubleshooting)

## Community Resources

Check out our list of [Community Resources about RNTL](https://callstack.github.io/react-native-testing-library/docs/guides/community-resources).

## Made with ❤️ at Callstack

React Native Testing Library is an open source project and will always remain free to use. If you think it's cool, please star it 🌟. [Callstack](https://callstack.com) is a group of React and React Native geeks, contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need any help with these or just want to say hi!

Like the project? ⚛️ [Join the team](https://callstack.com/careers/?utm_campaign=Senior_RN&utm_source=github&utm_medium=readme) who does amazing stuff for clients and drives React Native Open Source! 🔥

---

Supported and used by [Rally Health](https://www.rallyhealth.com/careers).

<!-- badges -->

[version-badge]: https://img.shields.io/npm/v/@testing-library/react-native.svg?style=flat-square
[package]: https://www.npmjs.com/package/@testing-library/react-native
[build-badge]: https://github.com/callstack/react-native-testing-library/actions/workflows/ci.yml/badge.svg
[build]: https://github.com/callstack/react-native-testing-library/actions/workflows/ci.yml
[coverage-badge]: https://img.shields.io/codecov/c/github/callstack/react-native-testing-library.svg
[coverage]: https://codecov.io/github/callstack/react-native-testing-library
[downloads-badge]: https://img.shields.io/npm/dm/@testing-library/react-native.svg?style=flat-square
[downloads]: http://www.npmtrends.com/@testing-library/react-native
[license-badge]: https://img.shields.io/npm/l/@testing-library/react-native.svg
[license]: https://opensource.org/licenses/MIT
[callstack-badge]: https://callstack.com/images/callstack-badge.svg
[callstack]: https://callstack.com/open-source/?utm_source=github.com&utm_medium=referral&utm_campaign=react-native-testing-library&utm_term=readme
