# Troubleshooting

This guide describes common issues found by users when integrating React Native Test Library to their projects:

## Matching React Native, React & React Test Renderer versions

Check that you have matching versions of core dependencies:

- React Native
- React
- React Test Renderer

React Native uses different versioning scheme from React, you can use [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) to find the correct matching between React Native & React versions. In case you use Expo, run `npx expo install --fix` in your project to validate and install compatible versions of these dependencies.

React Test Renderer usually has same major & minor version as React, as they are closely related and React Test Renderer is part of [React monorepo](https://github.com/facebook/react).

Related issues: [#1061](https://github.com/callstack/react-native-testing-library/issues/1061), [#938](https://github.com/callstack/react-native-testing-library/issues/938), [#920](https://github.com/callstack/react-native-testing-library/issues/920)

Errors that might indicate that you are facing this issue:

- `TypeError: Cannot read property 'current' of undefined` when calling `render()`
- `TypeError: Cannot read property 'isBatchingLegacy' of undefined` when calling `render()`

## Example repository

We maintain an [example repository](https://github.com/callstack/react-native-testing-library/tree/main/examples/basic) that showcases a modern React Native Testing Library setup with TypeScript, etc.

In case something does not work in your setup you can refer to this repository for recommended configuration.

## Undefined component error

> Warning: React.jsx: type is invalid -- expected a string (for built-in components) or a class/function (for composite components) but got: undefined.

This frequently happens when you mock a complex module incorrectly, e.g.:

```ts
jest.mock('@react-navigation/native', () => {
  return {
    useNavigation: jest.fn(),
  };
});
```

The above mock will mock `useNavigation` hook as intended, but at the same time all other exports from `@react-navigation/native` package are now `undefined`. If you want to use `NavigationContainer` component from the same package it will be `undefined` and result in the error above.

In order to mock only a part of given package you should re-export all other exports using `jest.requireActual` helper:

```ts
jest.mock('@react-navigation/native', () => {
  return {
    ...jest.requireActual('@react-navigation/native'),
    useNavigation: jest.fn(),
  };
});
```

That way the mock will re-export all of the `@react-navigation/native` members and overwrite only the `useNavigation` hook.

Alternatively, you can use `jest.spyOn` to mock package exports selectively.

### Mocking React Native

In case of mocking `react-native` package you should not mock the whole package at once, as this approach has issues with `jest.requireActual` call. In this case it is recommended to mock particular library paths inside the package, e.g.:

```ts title=jest-setup.ts
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
```

## Act warnings

When writing tests you may encounter warnings connected with `act()` function. There are two kinds of these warnings:

- sync `act()` warning - `Warning: An update to Component inside a test was not wrapped in act(...)`
- async `act()` warning - `Warning: You called act(async () => ...) without await`

You can read more about `act()` function in our [understanding `act` function guide](/react-native-testing-library/12.x/docs/advanced/understanding-act.md).

Normally, you should not encounter sync `act()` warnings, but if that happens this probably indicate an issue with your test and should be investigated.

In case of async `act()` function this might happen more or less randomly, especially if your components contain async logic. So far this warning does not seem to affect test correctness.
