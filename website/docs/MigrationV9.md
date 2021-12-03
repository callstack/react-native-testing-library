---
id: migration-v9
title: Migration to 9.0
---

Version 7.0 brought React Native Testing Library into the `@testing-library` family. Since it has been implemented independently from its web counterpart – the React Testing Library – there are some differences in the API and behavior. Version 9.0 solves several of these problems.

## Support for text match options a.k.a string precision API

This is a backward compatible change.

When querying text, it is now possible to pass a [`TextMatch`](https://callstack.github.io/react-native-testing-library/docs/api-queries/#textmatch) to most text based queries, which lets you configure how `@testing-library/react-native` should match your text. For instance, passing `exact: false` will allow matching substrings and will ignore case:

```jsx
const { getByText } = render(<Text>Hello World</Text>);

getByText('Hello World'); // Matches
getByText('Hello'); // Doesn't match
getByText('hello', { exact: false }); // ignore case-sensitivity and does partial matching
```

Please note that the `findBy*` queries used to take a `waitForOptions` parameter as a second argument, which has now been moved to the third argument:

```diff
-findByText('Hello world', { timeout: 3000 }); // old findBy* API
+findByText('Hello world', {}, { timeout: 3000 }); // new findBy* API
```

For backward compatibility RNTL v9 can still read `waitForOptions` from the second argument but will print a deprecation warning.

## Reverted matching text across several nodes

:::caution
This is a breaking change.
:::

In v1.14 we've introduced a feature allowing to match text when it's spread across several nodes:

```tsx
const { getByText } = render(
  <Text>
    Hello <Text>world</Text>
  </Text>
);
getByText('Hello world'); // matches
```

However this behavior was different than the web one, and wouldn't always be straightforward to reason about. For instance it could match text nodes far from each other on the screen. It also prevented us from implementing the string precision API. From v9, this type of match will not work.

A work around is to use `within`:

```tsx
import {Text} from 'react-native'
import {render, within} from '@testing-library/react-native'

const {getByText} = render(<Text>Hello <Text>world</Text</Text>)

within(getByText('Hello', {exact: false})).getByText('world')
```

## Future plans

This release changes a lot of internal logic in the library, paving the way for more improvements to bring us closer to our web counterpart, with a possibly better story for accessibility queries.

We're also [migrating the codebase to TypeScript](https://github.com/callstack/react-native-testing-library/issues/877). Please let us know if you're interested in helping us with this effort.

Stay safe!
