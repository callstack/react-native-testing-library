# Testing environment

:::info

This document is intended for a more advanced audience who want to understand the internals of our testing environment better, e.g., to contribute to the codebase. You should be able to write integration or component tests without reading this.

:::

React Native Testing Library lets you write integration and component tests for your React Native app or library. While the JSX code in tests closely resembles your React Native app, the underlying environment differs. This document describes the key elements of our testing environment and highlights things to be aware of when writing advanced tests or diagnosing issues.

## React renderers

React allows you to write declarative code using JSX, write function or class components, or use hooks like `useState`. You need to use a renderer to output the results of your components. Every React app uses some renderer:

- React Native is a renderer for mobile apps,
- React DOM is a renderer for web apps,
- There are other more [specialized renderers](https://github.com/chentsulin/awesome-react-renderer) that can e.g., render to console or HTML canvas.

When you run your tests in the React Native Testing Library, somewhat contrary to what the name suggests, they are actually **not** using React Native renderer. This is because this renderer needs to be run on an iOS or Android operating system, so it would need to run on a device or simulator.

## Test Renderer

Instead, RNTL uses [Test Renderer](https://github.com/mdjastrzebski/test-renderer), a modern, actively maintained renderer that renders to pure JavaScript objects without access to mobile OS and runs in a Node.js environment using Jest (or any other JavaScript test runner). Test Renderer replaces the deprecated `react-test-renderer` package and has better compatibility with React 19 and improved type safety.

Using Test Renderer has trade-offs:

Benefits:

- Tests run on most CIs (Linux, etc) without a mobile device or emulator
- Faster test execution
- Light runtime environment

Limitations:

- Tests don't execute native code
- Tests are unaware of view state managed by native components, e.g., focus, unmanaged text boxes, etc.
- Assertions don't operate on native view hierarchy
- Runtime behaviors are simulated, sometimes imperfectly

It's worth noting that the React Testing Library (web one) works a bit differently. While RTL also runs in Jest, it has access to a simulated browser DOM environment from the `jsdom` package, which allows it to use a regular React DOM renderer. Unfortunately, there is no similar React Native runtime environment package. This is probably because while the browser environment is well-defined and highly standardized, the React Native environment constantly evolves in sync with the evolution of underlying OS-es. Maintaining such an environment would require duplicating countless React Native behaviors and keeping them in sync as React Native develops.

## Element tree

Calling the `render()` function creates an element tree. This is done internally by invoking the `createRoot()` function from Test Renderer. The output tree represents your React Native component tree, containing only host elements. Each node of that tree corresponds to a host component that would have a counterpart in the native view hierarchy.

These tree elements are represented by `HostElement` type from Test Renderer:

```tsx
interface HostElement {
  type: ElementType;
  props: { [propName: string]: any };
  parent: HostElement | null;
  children: Array<HostElement | string>;

  // Other props and methods
}
```

For more details, see the [Test Renderer documentation](https://github.com/mdjastrzebski/test-renderer).

## Host and composite components

To understand RNTL's element tree, it's important to know the difference between host and composite components in React Native:

- [Host components](https://reactnative.dev/architecture/glossary#react-host-components-or-host-components) have direct counterparts in the native view tree. Typical examples are `<View>`, `<Text>`, `<TextInput>`, and `<Image>` from React Native. You can think of these as an analog of `<div>`, `<span>` etc on the Web. You can also create custom host views as native modules or import them from 3rd party libraries, like React Navigation or React Native Gesture Handler.
- [Composite components](https://reactnative.dev/architecture/glossary#react-composite-components) are React code organization units that exist only on the JavaScript side of your app. Typical examples are components you create (function and class components), components imported from React Native (`View`, `Text`, etc.), or 3rd party packages.

That might initially sound confusing since we put React Native's `View` in both categories. There are two `View` components: composite and host. The relation between them is as follows:

- Composite `View` is the type imported from the `react-native` package. It is a JavaScript component that renders the host `View` as its only child.
- Host `View`, which you do not render directly. React Native takes the props you pass to the composite `View`, does some processing on them and passes them to the host `View`.

In a full React tree, this would look like:

```jsx
* <View> (composite)
  * <View> (host)
    * children prop passed in JSX
```

A similar relation exists between other composite and host pairs: e.g. `Text`, `TextInput`, and `Image` components.

Not all React Native components are organized this way, e.g., when you use `Pressable` (or `TouchableOpacity`), there is no host `Pressable`, but composite `Pressable` is rendering a host `View` with specific props being set:

```jsx
* <Pressable> (composite)
  * <View accessible={true} {...}> (host)
    * children prop passed in JSX
```

### Host-only element tree

In RNTL v14, [Test Renderer](https://github.com/mdjastrzebski/test-renderer) only exposes host elements in the element tree. Composite components aren't visible in the tree—you only see their host element output. This aligns with Testing Library's philosophy: tests should focus on what users can see and interact with (host elements), not implementation details (composite components).

For a `HostElement`, the `type` prop is always a string value representing the host component name, e.g., `"View"`, `"Text"`, `"TextInput"`.

## Tree nodes

RNTL v14 queries and the element tree only expose host elements. Tests assert on what users can see and interact with. Host elements represent the actual UI controls users interact with, while composite components exist purely in the JavaScript domain.

### Understanding props

When asserting props on host elements, you're verifying what actually reaches the native view. This is important because composite components may process, transform, or even forget to pass props to their host children.

```jsx
function ForgotToPassPropsButton({ title, onPress, style }) {
  return (
    <Pressable>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

In the above example, the component accepts `onPress` and `style` props but doesn't pass them to host views, so they won't affect the user interface. By testing host elements, RNTL helps you catch these issues: if a prop doesn't reach a host element, users won't see or interact with it.

## Tree navigation

:::caution
You should avoid navigating over the element tree, as this makes your testing code fragile and may result in false positives. This section is more relevant for people who want to contribute to our codebase.
:::

You can navigate the tree of host elements using `parent` or `children` props of a `HostElement`. Be careful when doing this, as the tree structure for third-party components can change independently from your code and cause unexpected test failures.

## Queries

All Testing Library queries return host components to encourage the best practices described above. Since v14, RNTL uses [Test Renderer](https://github.com/mdjastrzebski/test-renderer), which only renders host elements, making it impossible to query composite components directly.
