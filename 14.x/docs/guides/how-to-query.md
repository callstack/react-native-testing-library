# How should I query?

React Native Testing Library provides various query types for finding views in tests. The number of queries can be confusing. This guide helps you pick the right queries for your test scenarios.

## Query parts

Each query is composed of two parts: variant and predicate, which are separated by the `by` word in the middle of the query.

Consider the following query:

```ts
getByRole();
```

For this query, `getBy*` is the query variant, and `*ByRole` is the predicate.

## Query variant

The query variants describe the expected number (and timing) of matching elements, so they differ in their return type.

| Variant                                                                              | Assertion                     | Return type                      | Is Async? |
| ------------------------------------------------------------------------------------ | ----------------------------- | -------------------------------- | --------- |
| [`getBy*`](/react-native-testing-library/14.x/docs/api/queries.md#get-by)            | Exactly one matching element  | `HostElement`                    | No        |
| [`getAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#get-all-by)     | At least one matching element | `Array<HostElement>`             | No        |
| [`queryBy*`](/react-native-testing-library/14.x/docs/api/queries.md#query-by)        | Zero or one matching element  | <code>HostElement \| null</code> | No        |
| [`queryAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#query-all-by) | No assertion                  | `Array<HostElement>`             | No        |
| [`findBy*`](/react-native-testing-library/14.x/docs/api/queries.md#find-by)          | Exactly one matching element  | `Promise<HostElement>`           | Yes       |
| [`findAllBy*`](/react-native-testing-library/14.x/docs/api/queries.md#find-all-by)   | At least one matching element | `Promise<Array<HostElement>>`    | Yes       |

Queries work as implicit assertions on the number of matching elements and will throw an error when the assertion fails.

### Idiomatic query variants

Idiomatic query variants clarify test intent and the expected number of matching elements. They will also throw helpful errors if assertions fail to help diagnose the issues.

Here are general guidelines for picking idiomatic query variants:

1. Use `getBy*` in the most common case when you expect a **single matching element**. Use other queries only in more specific cases.
2. Use `findBy*` when an element is not yet in the element tree, but you expect it to be there as a **result of some asynchronous action**.
3. Use `getAllBy*` (and `findAllBy*` for async) if you expect **more than one matching element**, e.g. in a list.
4. Use `queryBy*` only when element **should not exist** to use it together with e.g. [`not.toBeOnTheScreen()`](/react-native-testing-library/14.x/docs/api/jest-matchers.md#tobeonthescreen) matcher.

Avoid using `queryAllBy*` in regular tests, as it provides no assertions on the number of matching elements. You may still find it useful when building reusable custom testing tools.

## Query predicate

The query predicate describes how you decide whether to match the given element.

| Predicate                                                                                          | Supported elements | Inspected props                                                                                                   |
| -------------------------------------------------------------------------------------------------- | ------------------ | ----------------------------------------------------------------------------------------------------------------- |
| [`*ByRole`](/react-native-testing-library/14.x/docs/api/queries.md#by-role)                        | all host elements  | `role`, `accessibilityRole`,<br /> optional: accessible name, accessibility state and value                       |
| [`*ByLabelText`](/react-native-testing-library/14.x/docs/api/queries.md#by-label-text)             | all host elements  | `aria-label`, `aria-labelledby`,<br /> `accessibilityLabel`, `accessibilityLabelledBy`,<br /> `alt` (for `Image`) |
| [`*ByDisplayValue`](/react-native-testing-library/14.x/docs/api/queries.md#by-display-value)       | `TextInput`        | `value`, `defaultValue`                                                                                           |
| [`*ByPlaceholderText`](/react-native-testing-library/14.x/docs/api/queries.md#by-placeholder-text) | `TextInput`        | `placeholder`                                                                                                     |
| [`*ByText`](/react-native-testing-library/14.x/docs/api/queries.md#by-text)                        | `Text`             | `children` (text content)                                                                                         |
| [`*ByHintText`](/react-native-testing-library/14.x/docs/api/queries.md#by-hint-text)               | all host elements  | `accessibilityHint`                                                                                               |
| [`*ByTestId`](/react-native-testing-library/14.x/docs/api/queries.md#by-test-id)                   | all host elements  | `testID`                                                                                                          |

### Idiomatic query predicates

Choosing the right query predicate helps express test intent and makes tests resemble how users interact with your code (components, screens, etc.), following our [Guiding Principles](https://testing-library.com/docs/guiding-principles). Most predicates also promote proper accessibility props, which add a semantic layer on top of an element tree composed primarily of [`View`](https://reactnative.dev/docs/view) elements.

Use query predicates in the following order of priority:

### 1. By Role query \{#by-role-query}

The [`*ByRole`](/react-native-testing-library/14.x/docs/api/queries.md#by-role) predicate starts with the semantic role of the element and can be narrowed down with additional options. React Native has two role systems: the web/ARIA-compatible one based on [`role`](https://reactnative.dev/docs/accessibility#role) prop and the traditional one based on [`accessibilityRole`](https://reactnative.dev/docs/accessibility#accessibilityrole) prop. You can use either.

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

#### Name option \{#by-role-query-name-option}

Frequently, you will want to add the [`name`](/react-native-testing-library/14.x/docs/api/queries.md#by-role-options) option, which will match both the element's role and its accessible name (= element's accessibility label or text content).

Here are a couple of examples:

- start button: `getByRole("button", { name: "Start" })`
- silent mode switch: `getByRole("switch", { name: "Silent Mode" })`
- screen header: `getByRole("header", { name: "Settings" })`
- undo menu item: `getByRole("menuitem", { name: "Undo" })`
- error messages: `getByRole("alert", { name: /Not logged in/ })`

### 2. Text input queries \{#text-input-queries}

Querying [`TextInput`](https://reactnative.dev/docs/textinput) elements presents a unique challenge as there is no separate role for `TextInput` elements. There is a `searchbox`/`search` role, which can be assigned to `TextInput`, but it should be only used in the context of search inputs, leaving other text inputs without a role to query with.

Therefore, you can use the following queries to find relevant text inputs:

1. [`*ByLabelText`](/react-native-testing-library/14.x/docs/api/queries.md#by-label-text) - will match the accessibility label of the element. This query will match any host elements, including `TextInput` elements.
2. [`*ByPlaceholderText`](/react-native-testing-library/14.x/docs/api/queries.md#by-placeholder-text) - will match the placeholder of `TextInput` element. This query will match only `TextInput` elements.
3. [`*ByDisplayValue`](/react-native-testing-library/14.x/docs/api/queries.md#by-display-value) - will the current (or default) value of `TextInput` element. This query will match only `TextInput` elements.

### 3. Other accessible queries \{#other-accessible-queries}

These queries reflect the apps' user experience, both visual and through assistive technologies (e.g. screen reader).

These queries include:

- [`*ByText`](/react-native-testing-library/14.x/docs/api/queries.md#by-text) - will match the text content of the element. This query will match only `Text` elements.
- [`*ByLabelText`](/react-native-testing-library/14.x/docs/api/queries.md#by-label-text) - will match the accessibility label of the element.
- [`*ByHintText`](/react-native-testing-library/14.x/docs/api/queries.md#by-hint-text) - will match the accessibility hint of the element.

### 4. Test ID query \{#test-id-query}

As a final predicate, you can use the `testID` prop to find relevant views. Using the [`*ByTestId`](/react-native-testing-library/14.x/docs/api/queries.md#by-test-id) predicate offers the most flexibility, but at the same time, it does not represent the user experience, as users are not aware of test IDs.

Note that using test IDs is common in end-to-end testing due to various issues with querying views through other means **in that specific context**. For integration and component tests, use the recommended RNTL queries to make tests more reliable and resilient.
