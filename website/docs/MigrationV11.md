---
id: migration-v11
title: Migration to 1.0
---

Migration to React Native Testing Library version 11 from version 9.x or 10.x should be a relatively easy task due small amount of breaking changes.

# Breaking changes

## Update to Jest 28 if you use fake timers

If you use fake timers in any of your tests you should update your Jest dependencies to version 28. This is due to the fact that [`jest.useFakeTimers()` config structure](https://jestjs.io/docs/jest-object#jestusefaketimersfaketimersconfig) has changed.

## Refactor legacy `waitForOptions` position

In version 9 we introducted query `options` parameters for each query type. This affected all `findBy` and `findAllBy` queries because their signatures changed e.g. from:

```ts
function findByText(text: TextMatch, waitForOptions?: WaitForOptions)
function findAllByText(text: TextMatch, waitForOptions?: WaitForOptions)
```

to 

```ts
function findByText(text: TextMatch, options?: TextMatchOptions, waitForOptions?: WaitForOptions)
function findAllByText(text: TextMatch, options?: TextMatchOptions, waitForOptions?: WaitForOptions)
```

In order to facilitate transition, in version 9 and 10, we provided a temporary possibility to pass `WaitForOptions` like `timeout`, `interval`, etc inside `options` argument. From this release we require passing these as the proper third parameter.

This change is easy to implement:

```ts
findByText(/Text/, { timeout: 1000 })
```

should become

```ts
findByText(/Text/, {}, { timeout: 1000 })
```

## Triggering non-touch events on targes with `pointerEvents="box-none"` prop

Up to version 10, RNTL disables all events for a target with `pointerEvents="box-none"`. This behavior is counter to how React Native itself functions. 

From version 11, RNTL continues to disable `press` event for these targets but allows triggering other events, e.g. `layout`.

# All changes

* chore(breaking): update Jest to 28 by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/1008
* refactor(breaking): remove legacy wait for options support by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/1018
* refactor(breaking): remove `byA11yStates` queries by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/1015
* chore: update react-native to 0.69.1 by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/1010
* chore: update deps @types for react/react-native by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/1013
* feat: Trigger non-touch events on box-none targets by @dcalhoun in https://github.com/callstack/react-native-testing-library/pull/906
* docs: create document describing act function and related errors by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/969
* chore: Organise a11y queries by predicate by @MattAgn in https://github.com/callstack/react-native-testing-library/pull/977
* chore: reenable skipped byText tests by @mdjastrzebski in https://github.com/callstack/react-native-testing-library/pull/1017

# Full Changelog
https://github.com/callstack/react-native-testing-library/compare/v10.1.1...v11.0.0-rc.0

