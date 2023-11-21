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

The query predicate describes how you decide whether to match the given element.

| Predicate           | Components        | Inspected props                                                                             |
| ------------------- | ----------------- | ------------------------------------------------------------------------------------------- |
| `ByRole`            | all host elements | `role`, `accessibilityRole`,<br /> optional: accessible name, accessibility state and value |
| `ByText`            | `Text`            | `children` (text content)                                                                   |
| `ByDisplayText`     | `TextInput`       | `value`, `defaultValue`                                                                     |
| `ByPlaceholderText` | `TextInput`       | `placeholder`                                                                               |
| `ByLabelText`       | all host elements | `aria-label`, `aria-labelledby`,<br /> `accessibilityLabel`, `accessibilityLabelledBy`      |
| `ByHintText`        | all host elements | `accessibilityHint`                                                                         |
| `ByTestId`          | all host elements | `testID`                                                                                    |

In the list above, the `ByRole` query is by far the most powerful one, as it can be further optional requirements. Other queries are much simpler and target a
single property type.

#### Idiomatic query predicates

Choosing proper query predicate helps better express the test's intent and make the tests resemble how users interact with your code (components, screens, etc) as much as possible in accordance to our [Guiding Principles](https://testing-library.com/docs/guiding-principles).

Additionally, most of the predicates promote usage of proper accessibility props, which add a semantic layer on top of otherwise homogenous element tree.

1. The first and most versatile predicate is `ByRole` which starts with semantic role of element and can be further narrowed down with additional options. React Native has two role systems, the web/ARIA-compatible one based on [`role` prop](https://reactnative.dev/docs/accessibility#role), and the traditional one based on [`accessibilityRole` prop](https://reactnative.dev/docs/accessibility#accessibilityrole), you can use either of these.

In most cases you (or the component library you'll using), should be responsible for setting proper role props, so that both test code and assistive technologies like screen reader can better understand your view hierarchy. Some useful roles include:

- `alert` - important text to be presented to the user, e.g. error message
- `button`
- `checkbox` & `switch` - on/off controls
- `heading` (`header`) - header for content section, e.g. title of navigation bar
- `img` (`image`)
- `link`
- `menu` & `menuitem`
- `progressbar`
- `radiogroup` & `radio`
- `searchbox` (`search`)
- `slider` (`adjustable`)
- `summary`
- `tablist` & `tab`
- `text` - static text that cannot change
- `toolbar` - container for action buttons

Frequently you will want to add `name` option, which will match both element's role as well as his accessible name (= element's accessibility label or text content).

Here are a couple of examples:

- button Start : `getByRole("button", { name: "Start" })`
- silent mode switch: `getByRole("switch", { name: "Silent Mode" })`
- whole menu: `getByRole("menu", { name: "Editing Menu" })`
- particular menu item: `getByRole("menuitem", { name: "Undo" })`
- error messages: `getByRole("alert", { name: /Not logged in/ })`
- screen header: `getByRole("header", { name: "Settings" })`

Other useful options include:

- accessibility state like: `checked`, `selected`, `disabled`, `busy`, `expanded`
- accessibility value: `value: { now, min, max, text }`

However, these two types of check can frequently be better handled by corresponding Jest matchers like `toBeChecked()`, `toBeSelected()`, `toBeEnabled()`/`toBeDisabled()`, `toBeBusy()`, `toBeExpanded()`/`toBeCollapsed()`, and `toHaveAccessibilityValue()`.

### --- Old ---

1. **Queries Accessible to Everyone** queries that reflect the experience of visual users as well as those that use assistive technology
   - [`getByText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bytext): This is the number 1 method a user finds any visible text on interactive and non-interactive elements.
   - [`getByDisplayValue`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bydisplayvalue): Useful for the current value of a `TextInput`.
   - [`getByPlaceholderText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#byplaceholdertext): Only useful for targeting a placeholder of a `TextInput`.
   - [`getByLabelText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bylabeltext): This can be used to query every element that is exposed in the accessibility tree as a label, usually when there's no visible text.
   - [`getByHintText`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bya11yhint-byaccessibilityhint-byhinttext): This can be used to query every element that is exposed in the accessibility tree as a hint. Make sure it also has a label set.
   - [`getByAccessibilityState`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bya11ystate-byaccessibilitystate): This can be used to query every element that is exposed in the accessibility tree as a state of an interactive element, like a checkbox.
   - [`getByAccessibilityValue`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bya11value-byaccessibilityvalue): This can be used to query every element that is exposed in the accessibility tree as a value on a range, like a slider.
1. **Queries Users Can Infer**
   - [`getByRole`](https://callstack.github.io/react-native-testing-library/docs/api-queries#byrole): This can be used to query every element that is exposed in the accessibility tree as a role, like buttons or images.
1. **Test IDs**
   - [`getByTestId`](https://callstack.github.io/react-native-testing-library/docs/api-queries#bytestid): The user cannot see (or hear) these, so this is only recommended for cases where you can't match by text or it doesn't make sense

```

```
