# About Re.Pack

Before diving deep into Re.Pack and introducing it into project, it's important to understand when and why to use Re.Pack and how does it compare with alternatives.

## What Re.Pack actually is?

React Native environment and Browser environment have differences. React Native needs to run additional JS setup/init code so that it's usable at all. There's a great discrepancy between available APIs. In React Native we also have platform specific files — e.g.: `.ios.js`, `.android.js` and so on.

Putting all the above together, makes Webpack **unable to produce bundle** at all due to build errors and then the **bundle produced by Webpack is unusable** by default.

Therefore, we need to make changes to Webpack configuration and change how and what Webpack puts into the final bundle. All these necessary changes are encapsulated inside Re.Pack in form of Webpack plugins.

So to answer the question:

:::info

Re.Pack is what makes Webpack and Webpack-produced bundle usable in React Native application. Additionally, Re.Pack is what allows us to use [Code Splitting](./code-splitting/concepts) powered by Webpack inside React Native applications.

:::

## Why & when

The main feature of Re.Pack is Webpack and its ecosystem of loaders, plugins and support for various features like symlinks, aliases etc.

However, because Re.Pack is based on Webpack, **it is targeted towards advanced users who already know how to use Webpack** and want to leverage Webpack ecosystem.

:::tip

If you're just starting with React Native, it's better to stick with the default solution — Metro, since you probably won't benefit much from switching to Webpack and Re.Pack.

:::

## Design goals

1. Re.Pack was design for the advanced users, as such it exposes _low-level API_ in form of Webpack plugins and utilities, meaning we only give you the tools you need to build React Native application, but the actual configuration and maintenance of said config is on your shoulders.
2. To support wide variety of use cases and give you as much control as possible, Re.Pack is written to allow you to bundle and run development server directly from Webpack CLI as well by using React Native CLI. While it's recommended to stick with React Native CLI, you can pick one you want to go with.
3. Based on our experience with [Haul](https://github.com/callstack/haul), we shift as much responsibility onto you as possible, so that we can develop features, move at reasonable pace and reduce maintenance cost. Therefor, Re.Pack should be used by seasoned React Native developers with at least basic experience with Webpack.
4. **[Future]** We plan to use Re.Pack as a foundation for bringing multi-bundle support to React Native, by allowing you to use asynchronous chunks and finally Webpack 5 latest feature — [Module Federation](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669).

## Re.Pack vs Metro

Both Metro and Re.Pack have different approaches for the similar problem — bundling JavaScript code for your React Native application.

The main distinction is that, Metro is custom-built solution and Re.Pack uses Webpack. As a result there few differences that you should consider when deciding the solution to use:

- Metro is slightly faster - it has less overhead compared to Webpack. Metro trades configurability for performance, whereas with Webpack it's the other way around.
- Webpack configuration options and ecosystem allows for much greater control and support for advanced use-cases.
- Metro's Fast Refresh is slightly more flexible compared to Webpack's solution: Hot Module Replacement + React Refresh — some cases require full application reloaded with Webpack and Re.Pack, but they are supported with Metro See: [Known issues](./known-issues).

## Re.Pack vs Haul

Re.Pack is a direct successor to [Haul](https://github.com/callstack/haul). Therefore we took the experience we gained with Haul while making rather major changes in the approach:

- Re.Pack has smaller footprint and allows for greater level of customization, since you have direct access to the Webpack config.
- Re.Pack supports Hot Module Replacement + React Refresh, whereas Haul does not.
- Haul supports legacy implementation of multi-bundling (though it requires to alter React Native source code, so we don't recommend that), whereas Re.Pack supports code splitting and in the future [Module Federation](https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669).
- Re.Pack delivers better Developer Experience by providing you with more meaningful logs, easier usage and more customizability.

## Re.Pack vs `@callstack/nativepack`

Re.Pack is a rebranded version of `@callstack/nativepack`, which was a temporary name to avoid infringing on Webpack trademark. They are both the same projects.
