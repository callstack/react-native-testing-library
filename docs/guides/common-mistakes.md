# Common Mistakes with React Native Testing Library

> **Note:** This guide is adapted from Kent C. Dodds' article ["Common mistakes with React Testing Library"](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library) for React Native Testing Library v13. The original article focuses on web React, but the principles apply to React Native as well. This adaptation includes React Native-specific examples and ARIA-compatible accessibility attributes.

React Native Testing Library guiding principle is:

> "The more your tests resemble the way your software is used, the more confidence they can give you."

This guide outlines some common mistakes people make when using React Native Testing Library and how to avoid them.

## Using the wrong query \{#using-the-wrong-query}

Importance: high

React Native Testing Library provides several query types. Here's the priority order:

1. **Queries that reflect user experience:**
   - `getByRole` - most accessible
   - `getByLabelText` - accessible label
   - `getByPlaceholderText` - `TextInput` placeholder text
   - `getByText` - text content
   - `getByDisplayValue` - `TextInput` input value

2. **Semantic queries:**
   - `getByTestId` - only if nothing else works

Here's an example of using the right query:

```tsx
import { TextInput, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('finds input by label', () => {
  render(
    <View>
      <TextInput aria-label="Username" placeholder="Enter username" value="" />
    </View>
  );

  // ✅ Good - uses accessible label
  const input = screen.getByLabelText('Username');

  // ✅ Also good - uses placeholder
  const inputByPlaceholder = screen.getByPlaceholderText('Enter username');

  // ❌ Bad - uses testID when accessible queries work
  // const input = screen.getByTestId('username-input');
});
```

## Not using `*ByRole` query most of the time \{#not-using-byrole-most-of-the-time}

Importance: high

`getByRole` is the most accessible query and should be your first choice. It queries elements by their semantic role:

```tsx
import { Pressable, Text, TextInput, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('uses role queries', () => {
  render(
    <View>
      <Pressable role="button">
        <Text>Submit</Text>
      </Pressable>
      <TextInput role="searchbox" aria-label="Search" placeholder="Search..." />
    </View>
  );

  // ✅ Good - uses role query
  const button = screen.getByRole('button', { name: 'Submit' });
  const searchbox = screen.getByRole('searchbox', { name: 'Search' });

  expect(button).toBeOnTheScreen();
  expect(searchbox).toBeOnTheScreen();
});
```

Common roles in React Native include:

- `button` - pressable elements
- `text` - static text
- `header` / `heading` - headers
- `searchbox` - search inputs
- `switch` - toggle switches
- `checkbox` - checkboxes
- `radio` - radio buttons
- And more...

Note: React Native supports both ARIA-compatible (`role`) and legacy (`accessibilityRole`) props. Prefer `role` for consistency with web standards.

## Using the wrong assertion \{#using-the-wrong-assertion}

Importance: high

React Native Testing Library provides built-in Jest matchers. Make sure you're using the right ones:

```tsx
import { Pressable, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('button is disabled', () => {
  render(
    <Pressable role="button" aria-disabled>
      <Text>Submit</Text>
    </Pressable>
  );

  const button = screen.getByRole('button', { name: 'Submit' });

  // ✅ Good - uses RNTL matcher
  expect(button).toBeDisabled();

  // ❌ Bad - doesn't use RNTL matcher
  expect(button.props['aria-disabled']).toBe(true);
});
```

Common matchers include:

- `toBeOnTheScreen()` - checks if element is rendered (replaces `toBeInTheDocument()`)
- `toBeDisabled()` - checks if element is disabled
- `toHaveTextContent()` - checks text content
- `toHaveAccessibleName()` - checks accessible name
- And more...

## Using `query*` variants for anything except checking for non-existence \{#using-query-variants-for-anything-except-checking-for-non-existence}

Importance: high

Use `queryBy*` only when checking that an element doesn't exist:

```tsx
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('checks non-existence', () => {
  render(
    <View>
      <Text>Hello</Text>
    </View>
  );

  // ✅ Good - uses queryBy for non-existence check
  expect(screen.queryByText('Goodbye')).not.toBeOnTheScreen();

  // ❌ Bad - uses queryBy when element should exist
  // const element = screen.queryByText('Hello');
  // expect(element).toBeOnTheScreen();

  // ✅ Good - uses getBy when element should exist
  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

## Using `waitFor` to wait for elements that can be queried with `find*` \{#using-waitfor-to-wait-for-elements-that-can-be-queried-with-find}

Importance: high

Use `findBy*` queries instead of `waitFor` + `getBy*`:

```tsx
import { View, Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';

test('waits for element', async () => {
  const Component = () => {
    const [show, setShow] = React.useState(false);

    React.useEffect(() => {
      setTimeout(() => setShow(true), 100);
    }, []);

    return <View>{show && <Text>Loaded</Text>}</View>;
  };

  render(<Component />);

  // ✅ Good - uses findBy query
  const element = await screen.findByText('Loaded');
  expect(element).toBeOnTheScreen();

  // ❌ Bad - uses waitFor + getBy
  // await waitFor(() => {
  //   expect(screen.getByText('Loaded')).toBeOnTheScreen();
  // });
});
```

## Performing side-effects in `waitFor` \{#performing-side-effects-in-waitfor}

Importance: high

Don't perform side-effects in `waitFor` callbacks:

```tsx
import { Pressable, Text, View } from 'react-native';
import { render, screen, waitFor, fireEvent } from '@testing-library/react-native';

test('avoids side effects in waitFor', async () => {
  const Component = () => {
    const [count, setCount] = React.useState(0);
    return (
      <View>
        <Pressable role="button" onPress={() => setCount(count + 1)}>
          <Text>Increment</Text>
        </Pressable>
        <Text>Count: {count}</Text>
      </View>
    );
  };

  render(<Component />);

  const button = screen.getByRole('button');

  // ❌ Bad - side effect in waitFor
  // await waitFor(() => {
  //   fireEvent.press(button);
  //   expect(screen.getByText('Count: 1')).toBeOnTheScreen();
  // });

  // ✅ Good - side effect outside waitFor
  fireEvent.press(button);
  await waitFor(() => {
    expect(screen.getByText('Count: 1')).toBeOnTheScreen();
  });
});
```

## Using `UNSAFE_root` to query for elements \{#using-unsafe-root-to-query-for-elements}

Importance: high

React Native Testing Library provides an `UNSAFE_root` object that gives access to the root element, but you should avoid using it directly:

```tsx
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

test('finds element incorrectly', () => {
  const { UNSAFE_root } = render(
    <View>
      <Text testID="message">Hello</Text>
    </View>
  );

  // ❌ Bad - using UNSAFE_root directly
  const element = UNSAFE_root.findAll((node) => node.props.testID === 'message')[0];

  // ✅ Good - use proper queries
  // const element = screen.getByTestId('message');
});
```

Instead, use the proper query methods from `screen` or the `render` result. The `UNSAFE_root` is a low-level API that you rarely need.

## Passing an empty callback to `waitFor` \{#passing-an-empty-callback-to-waitfor}

Importance: high

Don't pass an empty callback to `waitFor`:

```tsx
import { View } from 'react-native';
import { render, waitFor } from '@testing-library/react-native';

test('waits correctly', async () => {
  render(<View testID="test" />);

  // ❌ Bad - empty callback
  // await waitFor(() => {});

  // ✅ Good - meaningful assertion
  await waitFor(() => {
    expect(screen.getByTestId('test')).toBeOnTheScreen();
  });
});
```

## Not using `screen` \{#not-using-screen}

Importance: medium

You can get all the queries from the `render` result:

```tsx
import { View, Text } from 'react-native';
import { render } from '@testing-library/react-native';

test('renders component', () => {
  const { getByText } = render(
    <View>
      <Text>Hello</Text>
    </View>
  );

  expect(getByText('Hello')).toBeOnTheScreen();
});
```

But you can also get them from the `screen` object:

```tsx
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('renders component', () => {
  render(
    <View>
      <Text>Hello</Text>
    </View>
  );

  expect(screen.getByText('Hello')).toBeOnTheScreen();
});
```

Using `screen` has several benefits:

1. You don't need to destructure `getByText` from `render`
2. It's more consistent with the Testing Library ecosystem

## Wrapping things in `act` unnecessarily \{#wrapping-things-in-act-unnecessarily}

Importance: medium

React Native Testing Library's `userEvent` methods are already wrapped in `act`, so you don't need to wrap them yourself:

```tsx
import { Pressable, Text, View } from 'react-native';
import { render, fireEvent, screen } from '@testing-library/react-native';

test('updates on press', () => {
  const Component = () => {
    const [count, setCount] = React.useState(0);
    return (
      <View>
        <Pressable role="button" onPress={() => setCount(count + 1)}>
          <Text>Count: {count}</Text>
        </Pressable>
      </View>
    );
  };

  render(<Component />);

  const button = screen.getByRole('button');

  // ✅ Good - fireEvent is already wrapped in act
  fireEvent.press(button);

  expect(screen.getByText('Count: 1')).toBeOnTheScreen();

  // ❌ Bad - unnecessary act wrapper
  // act(() => {
  //   fireEvent.press(button);
  // });
});
```

## Not using User Event API

Importance: medium

`userEvent` provides a more realistic way to simulate user interactions:

```tsx
import { Pressable, Text, TextInput, View } from 'react-native';
import { render, screen, userEvent } from '@testing-library/react-native';

test('uses userEvent', async () => {
  const user = userEvent.setup();

  const Component = () => {
    const [value, setValue] = React.useState('');
    return (
      <View>
        <TextInput aria-label="Name" value={value} onChangeText={setValue} />
        <Pressable role="button" onPress={() => setValue('')}>
          <Text>Clear</Text>
        </Pressable>
      </View>
    );
  };

  render(<Component />);

  const input = screen.getByLabelText('Name');
  const button = screen.getByRole('button', { name: 'Clear' });

  // ✅ Good - uses userEvent for realistic interactions
  await user.type(input, 'John');
  expect(input).toHaveValue('John');

  await user.press(button);
  expect(input).toHaveValue('');
});
```

`userEvent` methods are async and must be awaited. Available methods include:

- `press()` - simulates a press
- `longPress()` - simulates long press
- `type()` - simulates typing
- `clear()` - clears text input
- `paste()` - simulates pasting
- `scrollTo()` - simulates scrolling

## Not querying by text \{#not-querying-by-text}

Importance: medium

In React Native, text is rendered in `<Text>` components. You should query by the text content that users see:

```tsx
import { Text, View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('finds text correctly', () => {
  render(
    <View>
      <Text>Hello World</Text>
    </View>
  );

  // ✅ Good - queries by visible text
  expect(screen.getByText('Hello World')).toBeOnTheScreen();

  // ❌ Bad - queries by testID when text is available
  // expect(screen.getByTestId('greeting')).toBeOnTheScreen();
});
```

## Not using Testing Library ESLint plugins \{#not-using-testing-library-eslint-plugins}

Importance: medium

There's an ESLint plugin for Testing Library: [`eslint-plugin-testing-library`](https://github.com/testing-library/eslint-plugin-testing-library). This plugin can help you avoid common mistakes and will automatically fix your code in many cases.

You can install it with:

```bash
yarn add --dev eslint-plugin-testing-library
```

And configure it in your `eslint.config.js` (flat config):

```js
import testingLibrary from 'eslint-plugin-testing-library';

export default [testingLibrary.configs['flat/react']];
```

Note: Unlike React Testing Library, React Native Testing Library has built-in Jest matchers, so you don't need `eslint-plugin-jest-dom`.

## Using `cleanup` \{#using-cleanup}

Importance: medium

React Native Testing Library automatically cleans up after each test. You don't need to call `cleanup()` manually unless you're using the `pure` export (which doesn't include automatic cleanup).

If you want to disable automatic cleanup for a specific test, you can use:

```tsx
import { render } from '@testing-library/react-native/pure';

test('does not cleanup', () => {
  // This test won't cleanup automatically
  render(<MyComponent />);
  // ... your test
});
```

But in most cases, you don't need to worry about cleanup at all - it's handled automatically.

## Using `get*` variants as assertions \{#using-get-variants-as-assertions}

Importance: low

`getBy*` queries throw errors when elements aren't found, so they work as assertions. However, for better error messages, you might want to combine them with explicit matchers:

```tsx
import { View, Text } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('uses getBy as assertion', () => {
  render(
    <View>
      <Text>Hello</Text>
    </View>
  );

  // ✅ Good - getBy throws if not found, so it's an assertion
  const element = screen.getByText('Hello');
  expect(element).toBeOnTheScreen();

  // ✅ Also good - more explicit
  expect(screen.getByText('Hello')).toBeOnTheScreen();

  // ❌ Bad - redundant assertion
  // const element = screen.getByText('Hello');
  // expect(element).not.toBeNull(); // getBy already throws if null
});
```

## Having multiple assertions in a single `waitFor` callback \{#having-multiple-assertions-in-a-single-waitfor-callback}

Importance: low

Keep `waitFor` callbacks focused on a single assertion:

```tsx
import { View, Text } from 'react-native';
import { render, screen, waitFor } from '@testing-library/react-native';

test('waits with single assertion', async () => {
  const Component = () => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      setTimeout(() => setCount(1), 100);
    }, []);

    return (
      <View>
        <Text>Count: {count}</Text>
      </View>
    );
  };

  render(<Component />);

  // ✅ Good - single assertion per waitFor
  await waitFor(() => {
    expect(screen.getByText('Count: 1')).toBeOnTheScreen();
  });

  // If you need multiple assertions, do them after waitFor
  expect(screen.getByText('Count: 1')).toHaveTextContent('Count: 1');

  // ❌ Bad - multiple assertions in waitFor
  // await waitFor(() => {
  //   expect(screen.getByText('Count: 1')).toBeOnTheScreen();
  //   expect(screen.getByText('Count: 1')).toHaveTextContent('Count: 1');
  // });
});
```

## Using `wrapper` as the variable name \{#using-wrapper-as-the-variable-name}

Importance: low

This is not really a "mistake" per se, but it's a common pattern that can be improved. When you use the `wrapper` option in `render`, you might be tempted to name your wrapper component `Wrapper`:

```tsx
import { View } from 'react-native';
import { render, screen } from '@testing-library/react-native';

test('renders with wrapper', () => {
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <View testID="wrapper">{children}</View>
  );

  render(<View testID="content">Content</View>, {
    wrapper: Wrapper,
  });

  expect(screen.getByTestId('content')).toBeOnTheScreen();
});
```

This works fine, but it's more conventional to name it something more descriptive like `ThemeProvider` or `AllTheProviders` (if you're wrapping with multiple providers). This makes it clearer what the wrapper is doing.

## Summary

The key principles to remember:

1. **Use the right query** - Prefer `getByRole` as your first choice, use `findBy*` for async elements, and `queryBy*` only for checking non-existence
2. **Use proper assertions** - Use RNTL's built-in matchers (`toBeOnTheScreen()`, `toBeDisabled()`, etc.) instead of asserting on props directly
3. **Handle async operations correctly** - `userEvent` methods are async and must be awaited; `render()` and `fireEvent` are synchronous
4. **Use `waitFor` correctly** - Avoid side-effects in callbacks, use `findBy*` instead when possible, and keep callbacks focused
5. **Follow accessibility best practices** - Prefer ARIA attributes (`role`, `aria-label`) over `accessibility*` props
6. **Organize code well** - Use `screen` over destructuring, prefer `userEvent` over `fireEvent`, and don't use `cleanup()`

By following these principles, your tests will be more maintainable, accessible, and reliable.
