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

Related issues:
- [#1061](https://github.com/callstack/react-native-testing-library/issues/1061)
- [#938](https://github.com/callstack/react-native-testing-library/issues/938)

## Example repository

We maintain an [example repository](https://github.com/callstack/react-native-testing-library/tree/main/examples/basic) that showcases a modern React Native Testing Library setup with TypeScript, Jest Native, etc.

In case something does not work in your setup you can refer to this repository for recommended configuration.
