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

## 2. `*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return host components
`*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return host components, as all other queries.

While potentially breaking, this should not cause issues in tests if you are using recommended queries and Jest Matchers from Jest Native package. 

Problematic cases may include: examining `type` property of `ReactTestInstance`, referencing other nodes using `parent` or `children` props, etc.

## 3. `container` API has been renamed to `UNSAFE_root`.

Try using `root` API as a self alternative. The difference between these two propertie is that `root` will always represent a host component, while `UNSAFE_root` will typically represent a composite component.

# All changes

* TODO

# Full Changelog
https://github.com/callstack/react-native-testing-library/compare/v11.5.2...v12.0.0

