---
id: migration-v9
title: Migration to 9.0
---

Version 7.0 brought this package as the standard `react-native` implementation in the `@testing-library`. However it has been implemented independently from its web counterpart, therefore there were some differences in API an behaviour. Version 9.0 solves several of these problems.

# API changes

## Support for text match options a.k.a string precision API (backward compatible change)

When querying text, it is now possible to pass a [`TextMatch`](https://callstack.github.io/react-native-testing-library/docs/api-queries/#textmatch) to most text based queries, which lets you configure how `@testing-library/react-native` should match your text. For instance, passing `exact: false` will allow matching substrings and will ignore case.

```jsx
const { getByText } = render(<Text>Hello World</Text>);

getByText('Hello World'); // Matches
getByText('Hello'); // Doesn't match
getByText('hello', { exact: false }); // ignore case-sensitivity and does partial matching
```

`findBy*` queries used to take a `waitForOptions` parameter (e.g. `findByText('Hello world', {timeout: 3000})`), that parameter has been moved to the third place: `findByText('Hello world', {exact: true}, {timeout: 3000})`. For backward compatibility, `@testing-library/react-native@9.0` still reads `waitForOptions` from the second parameter but will print a deprecation warning: `findByText('Hello world', {timeout: 3000, exact: false})`.

## Stop matching across several nodes (breaking change)

When text is spread across several nodes `<Text>Hello <Text>world</Text</Text>`, `@testing-library/react-native` used to allow matching the full string `getByText('Hello world')`. However this behaviour was different than the web one, and wouldn't always be straightforward to reason about (it could match text nodes far from each other on the screen). From v9, this type of match will not work. A work around is to use `within`:

```tsx
import {Text} from 'react-native'
import {render, within} from '@testing-library/react-native'

const {getByText} = render(<Text>Hello <Text>world</Text</Text>)

// exact: false
within(getByText('Hello', {exact: false})).getByText('world')
```

# Future plans

This release changes a lot of internal logic in `@testing-library/react-native`, paving the way for more more improvements to bring us closer from our web counterpart, with for instance a better support for accessibility queries.
