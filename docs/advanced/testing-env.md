# Testing environment

:::info

This document is intended for a more advanced audience who want to understand the internals of our testing environment better, e.g., to contribute to the codebase. You should be able to write integration or component tests without reading this.

:::

React Native Testing Library allows you to write integration and component tests for your React Native app or library. While the JSX code used in tests closely resembles your React Native app, things aren't as simple as they might appear. This document describes the key elements of our testing environment and highlights things to be aware of when writing more advanced tests or diagnosing issues.

## React renderers

React allows you to write declarative code using JSX, write function or class components, or use hooks like `useState`. You need to use a renderer to output the results of your components. Every React app uses some renderer:

- React Native is a renderer for mobile apps,
- React DOM is a renderer for web apps,
- There are other more [specialized renderers](https://github.com/chentsulin/awesome-react-renderer) that can e.g., render to console or HTML canvas.

When you run your tests in the React Native Testing Library, somewhat contrary to what the name suggests, they are actually **not** using React Native renderer. This is because this renderer needs to be run on an iOS or Android operating system, so it would need to run on a device or simulator.

## React Test Renderer

Instead, RNTL uses React Test Renderer, a specialized renderer that allows rendering to pure JavaScript objects without access to mobile OS and can run in a Node.js environment using Jest (or any other JavaScript test runner).

Using React Test Renderer has pros and cons.

Benefits:

- tests can run on most CIs (Linux, etc) and do not require a mobile device or emulator
- faster test execution
- light runtime environment

Disadvantages:

- Tests do not execute native code
- Tests are unaware of the view state that would be managed by native components, e.g., focus, unmanaged text boxes, etc.
- Assertions do not operate on native view hierarchy
- Runtime behaviors are simulated, sometimes imperfectly

The React Testing Library (web one) works differently. While RTL also runs in Jest, it has access to a simulated browser DOM environment from the `jsdom` package, which allows it to use a regular React DOM renderer. Unfortunately, there's no similar React Native runtime environment package. This is probably because while the browser environment is well-defined and highly standardized, the React Native environment constantly evolves in sync with the evolution of underlying OS-es. Maintaining such an environment would require duplicating countless React Native behaviors and keeping them in sync as React Native develops.

## Element tree

Calling the `render()` function creates an element tree. This is done internally by invoking `TestRenderer.create()` method. The output tree represents your React Native component tree, and each node of that tree is an "instance" of some React component (to be more precise, each node represents a React fiber, and only class components have instances, while function components store the hook state using fibers).

These tree elements are represented by `ReactTestInstance` type:

```tsx
interface ReactTestInstance {
  type: ElementType;
  props: { [propName: string]: any };
  parent: ReactTestInstance | null;
  children: Array<ReactTestInstance | string>;

  // Other props and methods
}
```

Based on: [https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-test-renderer/index.d.ts](https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-test-renderer/index.d.ts)

## Host and composite components

One of the most important aspects of the element tree is that it is composed of both host and composite components:

- [Host components](https://reactnative.dev/architecture/glossary#react-host-components-or-host-components) will have direct counterparts in the native view tree. Typical examples are `<View>`, `<Text>` , `<TextInput>`, and `<Image>` from React Native. You can think of these as an analog of `<div>`, `<span>` etc on the Web. You can also create custom host views as native modules or import them from 3rd party libraries, like React Navigation or React Native Gesture Handler.
- [Composite components](https://reactnative.dev/architecture/glossary#react-composite-components) are React code organization units that exist only on the JavaScript side of your app. Typical examples are components you create (function and class components), components imported from React Native (`View`, `Text`, etc.), or 3rd party packages.

That might initially sound confusing since we put React Native's `View` in both categories. There are two `View` components: composite and host. The relation between them is as follows:

- composite `View` is the type imported from the `react-native` package. It is a JavaScript component that renders the host `View` as its only child in the element tree.
- host `View`, which you do not render directly. React Native takes the props you pass to the composite `View`, does some processing on them and passes them to the host `View`.

The part of the tree looks as follows:

```jsx
* <View> (composite)
  * <View> (host)
    * children prop passed in JSX
```

A similar relation exists between other composite and host pairs: e.g. `Text` , `TextInput`, and `Image` components:

```jsx
* <Text> (composite)
  * <Text> (host)
    * string (or mixed) content
```

Not all React Native components are organized this way, e.g., when you use `Pressable` (or `TouchableOpacity`), there is no host `Pressable`, but composite `Pressable` is rendering a host `View` with specific props being set:

```jsx
* <Pressable> (composite)
  * <View accessible={true} {...}> (host)
    * children prop passed in JSX
```

### Differentiating between host and composite elements

Any easy way to differentiate between host and composite elements is the `type` prop of `ReactTestInstance`:

- for host components, it's always a string value representing a component name, e.g., `"View"`
- for composite components, it's a function or class corresponding to the component

You can use the following code to check if a given element is a host one:

```jsx
function isHostElement(element: ReactTestInstance) {
  return typeof element.type === 'string';
}
```

## Tree nodes

We encourage you to only assert values on host views in your tests because they represent the user interface view and controls that users can see and interact with. Users can't see or interact with composite views as they exist purely in the JavaScript domain and don't generate any visible UI.

### Asserting props

For example, suppose you assert a `style` prop of a composite element. In that case, there is no guarantee that the style will be visible to the user, as the component author can forget to pass this prop to some underlying `View` or other host component. Similarly `onPress` event handler on a composite prop can be unreachable by the user.

```jsx
function ForgotToPassPropsButton({ title, onPress, style }) {
  return (
    <Pressable>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

In the above example, user-defined components accept both `onPress` and `style` props but do not pass them (through `Pressable`) to host views, so they will not affect the user interface. Additionally, React Native and other libraries might pass some of the props under different names or transform their values between composite and host components.

## Tree navigation

:::caution
You should avoid navigating over the element tree, as this makes your testing code fragile and may result in false positives. This section is more relevant for people who want to contribute to our codebase.
:::

You will encounter host and composite elements when navigating a tree of react elements using `parent` or `children` props of a `ReactTestInstance` element. You should be careful when navigating the element tree, as the tree structure for third-party components can change independently from your code and cause unexpected test failures.

Inside RNTL, we have various tree navigation helpers: `getHostParent`, `getHostChildren`, etc. These are intentionally not exported, as using them is not recommended.

## Queries

All recommended Testing Library queries return host components to encourage the best practices described above.

Only `UNSAFE_*ByType` and `UNSAFE_*ByProps` queries can return both host and composite components depending on used predicates. They are marked as unsafe precisely because testing composite components makes your test more fragile.
