# Troubleshooting

This guide describes common issues found by users when integrating React Native Test Library to their projects:

## Example repository

We maintain an [example repository](https://github.com/callstack/react-native-testing-library/tree/main/examples/basic) with a React Native Testing Library setup using TypeScript.

If something doesn't work in your setup, check this repository for configuration examples.

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

To mock only part of a package, re-export all other exports using `jest.requireActual`:

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

When mocking the `react-native` package, don't mock the whole package at once, as this has issues with `jest.requireActual`. Mock specific library paths inside the package instead, e.g.:

```ts title=jest-setup.ts
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter');
```

## Act warnings

When writing tests you may encounter warnings connected with `act()` function. There are two kinds of these warnings:

- sync `act()` warning - `Warning: An update to Component inside a test was not wrapped in act(...)`
- async `act()` warning - `Warning: You called act(async () => ...) without await`

You can read more about `act()` function in our [understanding `act` function guide](/react-native-testing-library/14.x/docs/advanced/understanding-act.md).

Normally, you should not encounter sync `act()` warnings, but if that happens this probably indicate an issue with your test and should be investigated.

In case of async `act()` function this might happen more or less randomly, especially if your components contain async logic. So far this warning does not seem to affect test correctness.
