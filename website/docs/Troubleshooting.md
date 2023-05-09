---
id: troubleshooting
title: Troubleshooting
---

This guide describes common issues found by users when integrating React Native Test Library to their projects.

## Matching React Native, React & React Test Renderer versions

Check that you have matching versions of core dependencies:

- React Native
- React
- React Test Renderer

React Native uses different versioning scheme from React, you can use [React Native Upgrade Helper](https://react-native-community.github.io/upgrade-helper/) to find the correct matching between React Native & React versions. In case you use Expo, you should use dependency versions recommended by them and set by `expo upgrade` command.

React Test Renderer usually has same major & minor version as React, as they are closely related and React Test Renderer is part of [React monorepo](https://github.com/facebook/react).

Related issues: [#1061](https://github.com/callstack/react-native-testing-library/issues/1061), [#938](https://github.com/callstack/react-native-testing-library/issues/938), [#920](https://github.com/callstack/react-native-testing-library/issues/920)

Errors that might indicate that you are facing this issue:

- `TypeError: Cannot read property 'current' of undefined` when calling `render()`
- `TypeError: Cannot read property 'isBatchingLegacy' of undefined` when calling `render()`

## Example repository

We maintain an [example repository](https://github.com/callstack/react-native-testing-library/tree/main/examples/basic) that showcases a modern React Native Testing Library setup with TypeScript, Jest Native, etc.

In case something does not work in your setup you can refer to this repository for recommended configuration.

## Act warnings

When writing tests you may encounter warnings connected with `act()` function. There are two kinds of these warnings:

- sync `act()` warning - `Warning: An update to Component inside a test was not wrapped in act(...)`
- async `act()` warning - `Warning: You called act(async () => ...) without await`

You can read more about `act()` function in our [understanding `act` function guide](https://callstack.github.io/react-native-testing-library/docs/understanding-act).

Normally, you should not encounter sync `act()` warnings, but if that happens this probably indicate an issue with your test and should be investigated.

In case of async `act()` function this might happen more or less randomly, especially if your components contain async logic. So far this warning does not seem to affect test correctness.
