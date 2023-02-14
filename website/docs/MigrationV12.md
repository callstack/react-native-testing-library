---
id: migration-v12
title: Migration to 12.0
---

Migration to React Native Testing Library version 12 from version 11.x should be a relatively easy task due small amount of breaking changes.

# Breaking changes

* `*ByRole` queries return only accessibility elements, either explicitly marked with `accessible` prop or implicit ones, where this status is derrived from component type, e.g `Text`, `TextInput`, `Switch`. You may need to adjust relevant components under test to make sure they pass `isAccessibilityElement` check.

* `*ByText`, `*ByDisplayValue`, `*ByPlaceholderText` queries now return host components, as all other queries. While potentially breaking, this should not cause issues in tests.

* `container` API has been renamed to `UNSAFE_root`. Try using `root` API as a self alternative. The difference between these two is that `root` will always be a root host component, while `UNSAFE_root` will typically return a composite component.

# All changes

* TODO

# Full Changelog
https://github.com/callstack/react-native-testing-library/compare/v11.5.2...v12.0.0

