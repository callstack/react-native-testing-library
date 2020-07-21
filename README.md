<div align='center'>
  <img
    height="80"
    width="80"
    alt="owl"
    src="https://raw.githubusercontent.com/callstack/react-native-testing-library/master/website/static/img/owl.png"
  />
  <h1>React Native Testing Library</h1>

  <p>Lightweight React Native testing utilities helping you write better tests with less effort.</P>
</div>

[![Version][version-badge]][package]
[![PRs Welcome][prs-welcome-badge]][prs-welcome]
[![Chat][chat-badge]][chat]
[![Sponsored by Callstack][callstack-badge]][callstack]

_Appreciation notice: This project is heavily inspired by [react-testing-library](https://github.com/testing-library/react-testing-library). Go check it out and use it to test your web React apps._

## The problem

You want to write maintainable tests for your React Native components without testing implementation details, but then you're told to use Enzyme, which you learn has no React Native adapter, meaning only shallow rendering is supported. And you want to render deep! But deep rendering may otherwise require jsdom (React Native isn't the web!), while doing deep rendering with `react-test-renderer` is so painful.

You would also like to use the newest React features, but you need to wait for your testing library's abstractions to catch up and it takes a while.

You finally want to approach testing using only best practices, while Enzyme may encourage assertions on implementation details.

## This solution

The `react-native-testing-library` is a lightweight solution for testing your React Native components. It provides light utility functions on top of `react-test-renderer` letting you always be up to date with latest React features and write any component tests you like. But really not any, it prevents you from testing implementation details because we stand this is a very bad practice.

This library is a replacement for [Enzyme](http://airbnb.io/enzyme/). It is tested to work with Jest, but it should work with other test runners as well.

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

#### Using `yarn`

```sh
yarn add --dev react-native-testing-library
```

#### Using `npm`

```sh
npm install --save-dev react-native-testing-library
```

This library has a peerDependencies listing for `react-test-renderer` and, of course, `react`. Make sure to install them too!

### Additional Jest matchers

In order to use addtional React Native-specific jest matchers from [@testing-library/jest-native](https://github.com/testing-library/jest-native) package add it to your project:

#### Using `yarn`

```sh
yarn add --dev @testing-library/jest-native
```

#### Using `npm`

```sh
npm install --save-dev @testing-library/jest-native
```

Then automatically add it to your jest tests by using `setupFilesAfterEnv` option in your Jest configuration (it's usually located either in `package.json` under `"jest"` key or in a `jest.config.js` file):

```json
{
  "preset": "react-native",
  "setupFilesAfterEnv": ["@testing-library/jest-native/extend-expect"]
}
```

### Flow

Note for [Flow](https://flow.org) users – you'll also need to install typings for `react-test-renderer`:

```sh
flow-typed install react-test-renderer
```

As you may have noticed, it's not tied to React Native at all – you can safely use it in your React components if you feel like not interacting directly with DOM.

## API / Usage

The [public API](https://callstack.github.io/react-native-testing-library/docs/api) of `react-native-testing-library` is focused around these essential methods:

- [`render`](https://callstack.github.io/react-native-testing-library/docs/api#render) – deeply renders given React element and returns helpers to query the output components.
- [`fireEvent`](https://callstack.github.io/react-native-testing-library/docs/api#fireevent) - invokes named event handler on the element.
- [`waitFor`](https://callstack.github.io/react-native-testing-library/docs/api#waitfor) - waits for non-deterministic periods of time until queried element is added or times out.
- [`waitForElementToBeRemoved`](https://callstack.github.io/react-native-testing-library/docs/api#waitforelementtoberemoved) - waits for non-deterministic periods of time until queried element is removed or times out.
- [`within`](https://callstack.github.io/react-native-testing-library/docs/api#within) - creates a queries object scoped for given element.

## Migration Guides

- [Migration to 2.0](https://callstack.github.io/react-native-testing-library/docs/migration-v2)

## Related External Resources

- [Real world extensive examples repo](https://github.com/vanGalilea/react-native-testing)
- [Where and how to start testing 🧪 your react-native app ⚛️ and how to keep on testin’](https://blog.usejournal.com/where-and-how-to-start-testing-your-react-native-app-%EF%B8%8F-and-how-to-keep-on-testin-ec3464fb9b41)

## Made with ❤️ at Callstack

React Native Testing Library is an open source project and will always remain free to use. If you think it's cool, please star it 🌟. [Callstack](https://callstack.com) is a group of React and React Native geeks, contact us at [hello@callstack.com](mailto:hello@callstack.com) if you need any help with these or just want to say hi!

---

Supported and used by [Rally Health](https://www.rallyhealth.com/careers-home).

<!-- badges -->

[version-badge]: https://img.shields.io/npm/v/react-native-testing-library.svg?style=flat-square
[package]: https://www.npmjs.com/package/react-native-testing-library
[prs-welcome-badge]: https://img.shields.io/badge/PRs-welcome-brightgreen.svg?style=flat-square
[prs-welcome]: http://makeapullrequest.com
[chat-badge]: https://img.shields.io/discord/426714625279524876.svg?style=flat-square&colorB=758ED3
[chat]: https://discord.gg/QbGezWe
[callstack-badge]: https://callstack.com/images/callstack-badge.svg
[callstack]: https://callstack.com/open-source/?utm_source=github.com&utm_medium=referral&utm_campaign=react-native-testing-library&utm_term=readme
