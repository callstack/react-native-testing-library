---
id: testing-env
title: Testing Environment
---

## Testing Environment

React Native Testing Library allows you to write integration and component tests for your React Native app or library. While the JSX code used in tests closely resembles your React Native app, the things are not quite simple as they might appear. In this document we will describe the key elements of our testing environment and highlight things to be aware when writing more advanced tests or diagnosing issues.

### React renderers

React allows you to write declarative code using JSX, write function or class components, or use hooks like `useState`. In order to output the results of your components it needs to work with a render. Every React app uses some type of renderer: React Native is a renderer for mobile apps, web apps use React DOM, and there are other more [specialised renderers](https://github.com/chentsulin/awesome-react-renderer) that can can e.g. render to console or HTML canvas.

When you run your tests in React Native Testing Library, somewhat contrary to what the name suggest, they are actually **not** using React Native render. This is because this renderer needs to be run on iOS or Android operating system, so it would need to run on device or simulator.

### React Test Render

Instead, RNTL uses React Test Renderer which is a specialised renderer that allows rending to pure JavaScript objects without access to mobile OS, and can run in Node.js environment using Jest (or other JavaScript test runners). 

Using React Test Renders has both pros and cons.

Benefits:

- tests can run on most CIs (linux, etc) and do not require mobile device or emulator
- faster test execution
- light runtime environment

Disadvantages:

- Tests do not execute native code
- Tests are not aware of view state that would be managed by native components, e.g. focus, unmanaged text boxes, etc.
- Assertions do not operate on native view hierarchy
- Runtime behaviours are simulated, sometimes imperfectly

It’s worth noting that React Testing Library (web one), works a bit different. While RTL also runs in Jest, it also has access to simulated browser DOM environment from jsdom package, so it can use a regular React DOM renderer. Unfortunately, there is no similar React Native runtime environment package. This is probably due to to the fact that while browser environment is well defined and highly standardised, the React Native environment is in constant evolution, in sync with the evolution of underlying OS-es. Maintaining such environment would require duplicating countless React Native behaviours, and keeping that in sync as React Native evolves.

### Element tree

Invoking `render()` functions results in creation of element tree. This is done internally by invoking `TestRendere.create()` method. The output tree represents your React Native component tree, each node of that tree is an “instance” of some React component (to be more precise: each node represents a React fiber, and only class components have instances, while function components store the hook state using fiber).

These tree elements are represented by `ReactTestInstance` type:

```jsx
// Based on: https://github.com/DefinitelyTyped/DefinitelyTyped/blob/master/types/react-test-renderer/index.d.ts
interface ReactTestInstance {
  type: ElementType;
  props: { [propName: string]: any };
  parent: ReactTestInstance | null;
  children: Array<ReactTestInstance | string>;

  // Other props and methods
}
```

### Host and composite components

One of the most important aspects of the element tree is that it is composed of both host and composite components:

- [Host components]([https://reactnative.dev/architecture/glossary#host-view-tree-and-host-view](https://reactnative.dev/architecture/glossary#react-host-components-or-host-components)) are components that will have direct counterparts in the native view tree. Typical examples are `<View>`, `<Text>` , `<TextInput>`, and `<Image>` from React Native. You can think of these as analogue of `<div>`, `<span>` etc on the Web. You can also create your own host views as native modules or import them from 3rd party libraries, like React Navigation or React Native Gesture Handler.
- [Composite components]([https://reactnative.dev/architecture/glossary#react-composite-components](https://reactnative.dev/architecture/glossary#react-composite-components)) are React code organisation units that exist only on the JavaScript side of your app. Typical examples are components you create (both function and class components), components imported from React Native (`View`, `Text`, etc) or from 3rd party packages.

That might sound a bit confusing at first, since we put React Native’s `View` in both categories. There are actually two `View` components: composite one and host one. The relation between them is as follows:

- composite `View` is the type imported from `react-native` package. It’s a JavaScript component, which renderers host `View` as its only child in the element tree.
- host `View` , which you do not render directly. React Native takes the props you pass to the composite `View`, does some processing on them and passes them to host `View`.

The part of the tree looks as follows:

```jsx
* <View> (composite)
	* <View> (host)
    * children prop passed in JSX
```

Similar relation exists between other composite and host pairs: e.g. `Text` , `TextInput` and `Image` components:

```jsx
* <Text> (composite)
	* <Text> (host)
    * string (or mixed) content
```

Not all React Native components are organised this way, e.g. when you use `Pressable` (or `TouchableOpacity`) there is no host `Pressable`, but composite `Pressable` is rendering a host `View` with certain props being set:

```jsx
* <Pressable> (composite)
	* <View accessible={true} {...}> (host)
    * children prop passed in JSX
```

#### Differentiating between host and composite elements

Any easy way to differentiate between host and composite elements is the `type` prop of `ReactTestInstance`:

- for host components it’s always a string value representing component name, e.g. `"View"`
- for composite components it’s function or class defining the component

You can use the following code to check if given element is a host one:

```jsx
function isHostElement(element: ReactTestInstance) {
  return typeof element.type === 'string';
}
```

### Tree nodes

We encourage you to only assert values on host views in your tests, because they represent the user interface view and controls that the user will be able to see and interact with. Users cannot see, or interact with, composite views as they exist purely in JavaScript domain and do not generate any visible UI.

#### Asserting props

As an example, if you make assertions on a `style` prop of a composite element, there is no guarantee that the style will be visible to the user, as the component author can forget to pass this prop to some underlying `View` or other host component. Similarly `onPress` event handler on a composite prop can be unreachable by the user.

```jsx
function ForgotToPassPropsButton({ title, onPress, style }) {
  return (
    <Pressable>
      <Text>{title}</Text>
    </Pressable>
  );
}
```

In the above example user defined components accepts both `onPress` and `style` props but does not pass it (through `Pressable`) to host views, so these props will not affect the user interface.

### Tree navigation

When navigating three using `parent` or `children` props of `ReactTestInstance` element, you will encounter both host and composite elements. You should be careful when navigating the element tree, as the tree structure for 3rd party components and change independently from your code and cause unexpected test failures.

If you want to find a host element for given element they you might use following code:

```jsx
function getHostParent(element: ReactTestInstance) {
  let current = element.parent;
  while (current) {
    if (isHostElement(current)) {
      return current;
    }

    current = current.parent;
  }

  return null;
}
```

### Queries

Most of the Testing Library queries return host components, in order to encourage best practices described above.

At this stage, there are some noteworthy exceptions:

- `*ByText` queries returns composite `Text` element
- `*ByDisplayValue` queries returns composite `TextInput` element
- `*ByPlaceholderText` queries returns composite `TextInput` element

This will change in the near future, as we make efforts for all queries to return host components. Meanwhile it should be a huge issue, as composite `Text` and `TextInput`generally pass their props down to host counterparts.

Additionally, `UNSAFE_*ByType` and `UNSAFE_*ByProps` queries can return both host and composite components depending on used predicates. They are marked as unsafe precisely because testing composite components makes your test more fragile.
