---
id: how-should-i-query
title: How Should I Query?
---

## Priority

Based on the [Guiding Principles](https://testing-library.com/docs/guiding-principles), your test should resemble how users interact with your code (component, page, etc.) as much as possible. With this in mind, we recommend this order of priority:

1. **Queries Accessible to Everyone** queries that reflect the experience of visual users as well as those that use assistive technology
   - [`getByText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bytext): This is the number 1 method a user finds any visible text on interactive and non-interactive elements.
   - [`getByDisplayValue`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bydisplayvalue): Useful for the current value of a `TextInput`.
   - [`getByPlaceholderText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#byplaceholdertext): Only useful for targeting a placeholder of a `TextInput`.
   - [`getByLabelText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bylabeltext): This can be used to query every element that is exposed in the accessibility tree as a label, usually when there's no visible text.
   - [`getByHintText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bya11yhint-byaccessibilityhint-byhinttext): This can be used to query every element that is exposed in the accessibility tree as a hint. Make sure it also has a label set.
   - [`getByAccessibilityState`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bya11ystate-byaccessibilitystate): This can be used to query every element that is exposed in the accessibility tree as a state of an interactive element, like a checkbox.
   - [`getByAccessibilityValue`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bya11value-byaccessibilityvalue): This can be used to query every element that is exposed in the accessibility tree as a value on a range, like a slider.
2. **Queries Users Can Infer**
   - [`getByRole`](https://callstack.github.io/react-native-testing-library/docs/api-queries#byrole): This can be used to query every element that is exposed in the accessibility tree as a role, like buttons or images.
3. **Test IDs**
   - [`getByTestId`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bytestid): The user cannot see (or hear) these, so this is only recommended for cases where you can't match by text or it doesn't make sense
