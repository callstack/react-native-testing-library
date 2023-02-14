---
id: migration-v12
title: Migration to 12.0
---

Migration to React Native Testing Library version 12 from version 11.x should be a relatively easy task due small amount of breaking changes.

# Breaking changes

1. `*ByRole` queries now return only accessibility elements, either explicitly marked with `accessible` prop or implicit ones where this status is derrived from component type itself (e.g `Text`, `TextInput`, `Switch`).

You may need to adjust relevant components under test to make sure they pass `isAccessibilityElement` check.

2. `*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return host components, as all other queries.

While potentially breaking, this should not cause issues in tests.

3. `container` API has been renamed to `UNSAFE_root`.

Try using `root` API as a self alternative. The difference between these two propertie is that `root` will always represent a host component, while `UNSAFE_root` will typically represent a composite component.

# All changes

* TODO

# Full Changelog
https://github.com/callstack/react-native-testing-library/compare/v11.5.2...v12.0.0

