---
id: how-should-i-query
title: How Should I Query?
---

React Native Testing Library provides various query types, allowing great flexibility in finding views appropriate for your tests. At the same time, the number of queries might be confusing. This guide aims to help you pick the correct queries for your test scenarios.

## Query parts

Each query is composed of two parts: variant and predicate, which are separated by the `by` word in the middle of the query.

Consider the following query:

```
getByRole()
```

For this query, `getBy*` is the query variant, and `*ByRole` is the predicate.

## Query variant

The query variants describe the expected number (and timing) of matching elements, so they differ in their return type.

| Variant                                   | Assertion                     | Return type                                | Is Async? |
| ----------------------------------------- | ----------------------------- | ------------------------------------------ | --------- |
| [`getBy*`](api-queries#get-by)            | Exactly one matching element  | `ReactTestInstance`                        | No        |
| [`getAllBy*`](api-queries#get-all-by)     | At least one matching element | `Array<ReactTestInstance>`                 | No        |
| [`queryBy*`](api-queries#query-by)        | Zero or one matching element  | <code>ReactTestInstance &#124; null</code> | No        |
| [`queryAllBy*`](api-queries#query-all-by) | No assertion                  | `Array<ReactTestInstance>`                 | No        |
| [`findBy*`](api-queries#find-by)          | Exactly one matching element  | `Promise<ReactTestInstance>`               | Yes       |
| [`findAllBy*`](api-queries#find-all-by)   | At least one matching element | `Promise<Array<ReactTestInstance>>`        | Yes       |

Queries work as implicit assertions on the number of matching elements and will throw an error when the assertion fails.

### Idiomatic query variants

Idiomatic query variants clarify test intent and the expected number of matching elements. They will also throw helpful errors if assertions fail to help diagnose the issues.

Here are general guidelines for picking idiomatic query variants:

1. Use `getBy*` in the most common case when you expect a **single matching element**. Use other queries only in more specific cases.
2. Use `findBy*` when an element is not yet in the element tree, but you expect it to be there as a **result of some asynchronous action**.
3. Use `getAllBy*` (and `findAllBy*` for async) if you expect **more than one matching element**, e.g. in a list.
4. Use `queryBy*` only when element **should not exist** to use it together with e.g. [`not.toBeOnTheScreen()`](jest-matchers#tobeonthescreen) matcher.

Avoid using `queryAllBy*` in regular tests, as it provides no assertions on the number of matching elements. You may still find it useful when building reusable custom testing tools.

## Query predicate

The query predicate describes how you decide whether to match the given element.

| Predicate                                               | Supported elements | Inspected props                                                                             |
| ------------------------------------------------------- | ------------------ | ------------------------------------------------------------------------------------------- |
| [`*ByRole`](api-queries#by-role)                        | all host elements  | `role`, `accessibilityRole`,<br /> optional: accessible name, accessibility state and value |
| [`*ByLabelText`](api-queries#by-label-text)             | all host elements  | `aria-label`, `aria-labelledby`,<br /> `accessibilityLabel`, `accessibilityLabelledBy`      |
| [`*ByDisplayValue`](api-queries#by-display-value)       | `TextInput`        | `value`, `defaultValue`                                                                     |
| [`*ByPlaceholderText`](api-queries#by-placeholder-text) | `TextInput`        | `placeholder`                                                                               |
| [`*ByText`](api-queries#by-text)                        | `Text`             | `children` (text content)                                                                   |
| [`*ByHintText`](api-queries#by-hint-text)               | all host elements  | `accessibilityHint`                                                                         |
| [`*ByTestId`](api-queries#by-test-id)                   | all host elements  | `testID`                                                                                    |

### Idiomatic query predicates

Choosing the proper query predicate helps better express the test's intent and make the tests resemble how users interact with your code (components, screens, etc.) as much as possible following our [Guiding Principles](https://testing-library.com/docs/guiding-principles). Additionally, most predicates promote the usage of proper accessibility props, which add a semantic layer on top of an element tree composed primarily of [`View`](https://reactnative.dev/docs/view) elements.

It is recommended to use query predicates in the following order of priority:

### 1. By Role query {#by-role-query}

The first and most versatile predicate is [`*ByRole`](api-queries#by-role), which starts with the semantic role of the element and can be further narrowed down with additional options. React Native has two role systems, the web/ARIA-compatible one based on [`role`](https://reactnative.dev/docs/accessibility#role) prop and the traditional one based on [`accessibilityRole`](https://reactnative.dev/docs/accessibility#accessibilityrole) prop, you can use either of these.

In most cases, you need to set accessibility roles explicitly (or your component library can set some of them for you). These roles allow assistive technologies (like screen readers) and testing code to understand your view hierarchy better.

Some frequently used roles include:

- `alert` - important text to be presented to the user, e.g., error message
- `button`
- `checkbox` & `switch` - on/off controls
- `heading` (`header`) - header for content section, e.g., the title of navigation bar
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

#### Name option {#by-role-query-name-option}

Frequently, you will want to add the [`name`](api-queries#by-role-options) option, which will match both the element's role and its accessible name (= element's accessibility label or text content).

Here are a couple of examples:

- start button: `getByRole("button", { name: "Start" })`
- silent mode switch: `getByRole("switch", { name: "Silent Mode" })`
- screen header: `getByRole("header", { name: "Settings" })`
- undo menu item: `getByRole("menuitem", { name: "Undo" })`
- error messages: `getByRole("alert", { name: /Not logged in/ })`

### 2. Text input queries {#text-input-queries}

Querying [`TextInput`](https://reactnative.dev/docs/textinput) elements presents a unique challenge as there is no separate role for `TextInput` elements. There is a `searchbox`/`search` role, which can be assigned to `TextInput`, but it should be only used in the context of search inputs, leaving other text inputs without a role to query with.

Therefore, you can use the following queries to find relevant text inputs:

1. [`*ByLabelText`](api-queries#by-label-text) - will match the accessibility label of the element. This query will match any host elements, including `TextInput` elements.
2. [`*ByPlaceholderText`](api-queries#by-placeholder-text) - will match the placeholder of `TextInput` element. This query will match only `TextInput` elements.
3. [`*ByDisplayValue`](api-queries#by-display-value) - will the current (or default) value of `TextInput` element. This query will match only `TextInput` elements.

### 3. Other accessible queries {#other-accessible-queries}

These queries reflect the apps' user experience, both visual and through assistive technologies (e.g. screen reader).

These queries include:

- [`*ByText`](api-queries#by-text) - will match the text content of the element. This query will match only `Text` elements.
- [`*ByLabelText`](api-queries#by-label-text) - will match the accessibility label of the element.
- [`*ByHintText`](api-queries#by-hint-text) - will match the accessibility hint of the element.

### 4. Test ID query {#test-id-query}

As a final predicate, you can use the `testID` prop to find relevant views. Using the [`*ByTestId`](api-queries#by-test-id) predicate offers the most flexibility, but at the same time, it does not represent the user experience, as users are not aware of test IDs.

Note that using test IDs is a widespread technique in end-to-end testing due to various issues with querying views through other means **in its specific context**. Nevertheless, we still encourage you to use recommended RNTL queries as it will make your integration and component test more reliable and resilient.
