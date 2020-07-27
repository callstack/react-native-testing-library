---
id: migration-v7
title: Migration to 7.0
---

:::caution
We renamed the `react-native-testing-library` npm package to `@testing-library/react-native`, joining the Testing Library family.
:::

As the version 7.0 involves merging two libraries together, there are two variants for migration guide, dependent on library you used previously:

- [guide for `react-native-testing-library` users](#guide-for-react-native-testing-library-users)
- [guide for `@testing-library/react-native` users](#guide-for-testing-libraryreact-native-users)

# Guide for `react-native-testing-library` users

This guide describes steps necessary to migrate from React Native Testing Library `v2.x` to `v7.0`.

## Renaming the library

1. Install `@testing-library/react-native`.
1. Uninstall `react-native-testing-library`.
1. Rename all references of `react-native-testing-library` to `@testing-library/react-native`.

You may have noticed a strange v2 to v7 upgrade, skipping versions 3, 4, 5 and 6. This is because we renamed the `react-native-testing-library` npm package to `@testing-library/react-native`, officially joining the "Testing Library" family 🎉. We're merging existing two libraries into a single one. The [native-testing-library](https://github.com/testing-library/native-testing-library) repository will soon be archived and using `@testing-library/react-native` below v7, sourced from mentioned repository, is deprecated.

For branding purposes we keep the "React Native Testing Library" name, similar to "React Testing Library". Only the npm published package is changing. The code repository also stays the same under Callstack governance.

## New aliases

To ease the migration of `@testing-library/react-native` users using version below v7, we've introduced new aliases to our accessibility queries:

- `ByLabelText` aliasing `ByA11yLabel` queries
- `ByHintText` aliasing `ByA11yHint` queries
- `ByRole` aliasing `ByA11yRole` queries

We like the new names and consider removing the aliases in future releases.

## Renaming `ByPlaceholder` queries

To ease the migration of `@testing-library/react-native` users using version below v7, we've renamed following queries:

- `ByPlaceholder` -> `ByPlaceholderText`

Please replace all occurrences of these queries in your codebase.

# Guide for `@testing-library/react-native` users

This guide describes steps necessary to migrate from `@testing-library/react-native` from `v6.0` to `v7.0`. Although the name stays the same, this is a different library, sourced at [Callstack GitHub repository](https://github.com/callstack/react-native-testing-library). We made sure the upgrade path is as easy for you as possible.

## Changed helpers

- `getQueriesForElement` is removed, rename it to `within`
- `wait` and `waitForElement` is removed, rename these to `waitFor`

## Missing queries

Our library doesn't implement `ByTitle` queries, which are targetting components with `title` prop, specifically `Button` and `RefreshControl`. If your tests only use `ByTitle` to target `Button` components, you can replace them with `ByText` queries, since React Native renders normal `Text` component under the hood.

If you need to query `RefreshControl` component and can't figure out other way around it, you can use e.g. `UNSAFE_getByProps({title})` query.

## No custom Jest configuration

Use the official React Native preset for Jest:

```diff
{
  "jest": {
-    "preset": "@testing-library/react-native"
+    "preset": "react-native"
  }
}
```

We're told this should also speed up your tests startup on cold cache. Using official preset has another benefit. The library is compatible with any version of React Native without introducing breaking changes.

## Cleanup is included by default

Cleaning up (unmounting) components after each test is included by default in the same manner as in React Testing Library. Please remove this setup file from Jest config:

```diff
{
  "jest": {
-    "setupFilesAfterEnv": ["@testing-library/react-native/cleanup-after-each"]
  }
}
```

You can opt-out of this behavior by running tests with `RNTL_SKIP_AUTO_CLEANUP=true` flag or importing from `@testing-library/react-native/pure`. We encourage you to keep the default though.

## No special handling for `disabled` prop

The `disabled` prop on "Touchable\*" components is treated in the same manner as any other prop. We realize that with our library you can press "touchable" components even though they're in "disabled" state, however this is something that we strongly believe should be fixed upstream, in React Native core.

If you feel strongly about this difference, please send a PR to React Native, adding JavaScript logic to "onPress" functions, making them aware of disabled state in JS logic as well (it's handled on native side for at least iOS, which is the default platform that tests are running in).

As a mitigation, you'll likely need to modify the logic of "touchable" components to bail if they're pressed in disabled state.

## No [NativeTestInstance](https://www.native-testing-library.com/docs/api-test-instance) abstraction

We don't provide any abstraction over `ReactTestInstance` returned by queries, but allow to use it directly to access queried component's `props` or `type` for that example.

## No `container` returned from `render`

There's no such key returned from the `render` function. If you must, use `react-test-renderer` directly, although we advise not doing so.

## Firing events changes

There are slight differences in how `fireEvent` works in both libraries:

1. Our library doesn't perform validation checks for events fired upon tested components.
1. Signature is different:
   ```diff
   -fireEvent[eventName](node: FiberRoot, eventProperties: NativeTestEvent)
   +fireEvent(element: ReactTestInstance, eventName: string, ...data: Array<any>)
   ```
1. There is no `NativeTestEvent` - second and rest arguments are used instead.
1. There are only 3 short-hand events: [`fireEvent.press`](`/docs/api/#fireeventpress-element-reacttestinstance--void`), [`fireEvent.changeText`](https://callstack.github.io/react-native-testing-library/docs/api/#fireeventchangetext-element-reacttestinstance-data-arrayany--void), [`fireEvent.scroll`](https://callstack.github.io/react-native-testing-library/docs/api/#fireeventchangetext-element-reacttestinstance-data-arrayany--void). For all other or custom events you can use the base signature.
