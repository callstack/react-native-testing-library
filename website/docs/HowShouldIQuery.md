---
id: how-should-i-query
title: How Should I Query?
---

React Native Testing Library provides various query types, allowing flexibility in finding views appropriate for your tests. At the same time, the number of queries might be confusing. This guide aims to help you pick the correct queries for your test scenarios.

## Query parts

Each query is composed of two parts: variant and predicate, which are separated by the `by` word in the middle of the query.

Consider the following query:

```
getByRole()
```

For this query, `get` is the query variant, and `ByRole` is the predicate.

### Query variant

The query variants describe the expected number (and timing) of matching elements, so differ in their return type.

| Variant    | Assertion                     | Return type                                | Is Async? |
| ---------- | ----------------------------- | ------------------------------------------ | --------- |
| `get`      | Exactly one matching element  | `ReactTestInstance`                        | No        |
| `getAll`   | At least one matching element | `Array<ReactTestInstance>`                 | No        |
| `query`    | Zero or one matching element  | <code>ReactTestInstance &#124; null</code> | No        |
| `queryAll` | No assertion                  | `Array<ReactTestInstance>`                 | No        |
| `find`     | Exactly one matching element  | `Promise<ReactTestInstance>`               | Yes       |
| `findAll`  | At least one matching element | `Promise<Array<ReactTestInstance>>`        | Yes       |

Queries work as implicit assertions on the number of matching elements and will throw an error when the assertion fails.

#### Idiomatic query variants

Using idiomatic query variants helps better express your test's intent and expectations about the number of matching elements. Using other query variants might work but could make it harder to reason about the test.

Here are general guidelines for picking idiomatic query variants:

1. Use `get` in the most common case when you expect a **single matching element**. Use other queries only in more specific cases.
2. Use `find` when an element is not yet in the element tree, but you expect it to be there as a **result of some asynchronous action**.
3. Use `getAll` (and `findAll` for async) if you expect **more than one matching element**, e.g. in a list.
4. Use `query` variant only when element **should not exist**, in order to pass it to e.g. `not.toBeOnTheScreen()` matcher.

Do not use `queryAll` as it does not provide any assertions on the number of matching elements.

### Query Predicate

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

```

```
