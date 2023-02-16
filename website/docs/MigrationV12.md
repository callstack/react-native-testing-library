---
id: migration-v12
title: Migration to 12.0
---

React Native Testing Library 12 introduces a handful of breaking changes compared to 11.x versions. We believe they were necessary to improve the experience using the library and help the users [fall into the pit of success](https://blog.codinghorror.com/falling-into-the-pit-of-success/) when writing meaningful tests. You will find migration instructions for each and every change described below.

# Breaking changes

## 1. `*ByRole` queries now return only accessibility elements
`*ByRole` queries now return only accessibility elements, either explicitly marked with `accessible` prop or implicit ones where this status is derrived from component type itself (e.g `Text`, `TextInput`, `Switch`, but not `View`).

You may need to adjust relevant components under test to make sure they pass `isAccessibilityElement` check.

### Examples
Let's assume we are using `getByRole("button")` query.

Following elements will match:

```ts
// Explicit "accessible" prop for View
<View accessible role="button" />

// No need to "accessible" prop for Text, as it is implicitly accessible element.
<Text role="button">Button</Text>
```

While following elements will not match:

```ts
// Missing "accessible" prop for View
<View accessible={false} role="button" />

// Explicit "accessible={false}" prop for View
<View accessible={false} role="button" />

// Explicit "accessible={false}" for Text,which is implicitly accessible element
<Text accessible={false} role="button">Button</Text>
```

## 2. `*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return host elements
`*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return [host elements](testing-env#host-and-composite-components), which is consistent with other queries.

While potentially breaking, this should not cause issues in tests if you are using recommended queries and Jest Matchers from Jest Native package. 

Problematic cases may include: directly checking some prop values (without using Jest Native matchers), referencing other nodes using `parent` or `children` props, examining `type` property of `ReactTestInstance`, etc.

## 3. `container` API has been renamed to `UNSAFE_root`.

Historically `container` was supposed to mimic the [RTL's container](https://testing-library.com/docs/react-testing-library/api/#container). However it turned out not so relevant in RNTL's environment, where we actually used it to return React Test Renderer's root instance.

RNTL v12 introduces `root` API as an alternative that returns a root **host** element. The difference between `root` and `UNSAFE_root` properties is that that `root` will always represents a host element, while `UNSAFE_root` will typically represent a composite element.

# All changes

* TODO

# Full Changelog
https://github.com/callstack/react-native-testing-library/compare/v11.5.2...v12.0.0

