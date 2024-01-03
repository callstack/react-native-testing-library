---
id: migration-v12
title: Migration to 12.0
---

import TOCInline from '@theme/TOCInline';

:::note
From v12.4:

If you are already using legacy Jest Native matchers we have a [migration guide](migration-jest-native) for moving to the built-in matchers.

Before v12.4:
If you use [Jest Native matchers](https://github.com/testing-library/jest-native), which we recommend, then you should upgrade it to version 5.4.2 or higher.
:::

React Native Testing Library 12 introduces a handful of breaking changes compared to 11.x versions. We believe they were necessary to improve the experience using the library and help the users [fall into the pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/) when writing meaningful tests. You will find migration instructions for each and every change described below.

<TOCInline toc={toc} />

## Breaking changes

### 1. All queries exclude elements hidden from accessibility by default

Elements that are hidden from accessiblity, e.g. elements on non-active screen when using React Navigation, now will not be matched by default by all queries. This is the effect of switching the default value for global config option `defaultIncludeHiddenElements`(api#defaultincludehiddenelements-option) to `false`.

Previous behaviour of matching hidden elements can be enabled on query level using [includeHiddenElements](api-queries#includehiddenelements-option) query options or globally using `defaultIncludeHiddenElements`(api#defaultincludehiddenelements-option) configuration option.

### 2. `*ByRole` queries now return only accessibility elements

`*ByRole` queries now return only accessibility elements, either explicitly marked with `accessible` prop or implicit ones where this status is derived from component type itself (e.g `Text`, `TextInput`, `Switch`, but not `View`).

You may need to adjust relevant components under test to make sure they pass `isAccessibilityElement` check.

#### Examples

Let's assume we are using `getByRole("button")` query.

Following elements will match:

```ts
// Explicit "accessible" prop for View
<View accessible accessibilityRole="button" />

// No need to "accessible" prop for Text, as it is implicitly accessible element.
<Text accessibilityRole="button">Button</Text>
```

While following elements will not match:

```ts
// Missing "accessible" prop for View
<View accessibilityRole="button" />

// Explicit "accessible={false}" prop for View
<View accessible={false} accessibilityRole="button" />

// Explicit "accessible={false}" for Text, which is implicitly accessible element
<Text accessible={false} accessibilityRole="button">Button</Text>
```

### 3. `*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return host elements

`*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return [host elements](testing-env#host-and-composite-components), which is consistent with other queries.

While potentially breaking, this should not cause issues in tests if you are using recommended queries and Jest Matchers from Jest Native package.

Problematic cases may include: directly checking some prop values (without using Jest Native matchers), referencing other nodes using `parent` or `children` props, examining `type` property of `ReactTestInstance`, etc.

### 4. `container` API has been renamed to `UNSAFE_root`.

Historically `container` was supposed to mimic the [RTL's container](https://testing-library.com/docs/react-testing-library/api/#container). However it turned out not so relevant in RNTL's environment, where we actually used it to return React Test Renderer's root instance.

RNTL v12 introduces `root` API as an alternative that returns a root **host** element. The difference between `root` and `UNSAFE_root` properties is that that `root` will always represents a host element, while `UNSAFE_root` will typically represent a composite element.

If you use `toBeOnTheScreen` matcher from [@testing-library/jest-native](https://github.com/testing-library/jest-native) your tests will fail because it uses the `container` api. To fix this, update `@testing-library/jest-native` to version 5.4.2.

## Full Changelog

https://github.com/callstack/react-native-testing-library/compare/v11.5.2...v12.0.0
