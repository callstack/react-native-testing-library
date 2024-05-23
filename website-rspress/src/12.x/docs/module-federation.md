# Module Federation

Before diving deep into Module Federation, it's important to understand how [Code Splitting](./code-splitting/concept) works in React Native with Re.Pack
and what are the challenges.

Module Federation is similar to [Code Splitting](./code-splitting/concept), but offers more control, flexibility and scalability.

:::tip

We highly recommend to read and understand [Code Splitting](./code-splitting/concept) first, before trying Module Federation:

- [Concept](./code-splitting/concept)
- [Usage](./code-splitting/usage)
- [Glossary](./code-splitting/glossary)

:::

:::info

Module Federation support in Re.Pack is still at early stages. We believe it should work for many cases, but if there's a use-case which we don't support,
don't hesitate to reach out and ask about it.

:::

## What is Module Federation?

Module Federation is an architecture, which splits the application into multiple pieces. These pieces are called containers.
Similarly to micro-services, Module Federation splits application into a distributed frontends, sometimes referred to as micro-frontends.

![Monolith vs Module Federation diagram](/img/monolith_vs_mf.svg)

### Benefits

The main benefits or Module Federation are:

- Ability to split application into multiple isolated micro-frontends.
- Ability to customize build configuration and process for each micro-frontend.
- Ability to dynamically load micro-frontends on demand.
- Ability to load different versions of the micro-fontends.
- Ability to use external micro-frontends.

Keep in mind that this list is not exhaustive. It's possible you could benefit from Module Federation in another way as well.

### Challenges

Not every project or application is a good fit for Module Federation. Due to nature of Module Federation there's are few challenges and overheads you need to consider:

- It's easy to cause dependency duplication, e.g. if you're using incompatible versions in micro-frontends/container.
- It requires coordination when configuring Webpack for each micro-frontend/container - otherwise, your micro-frontend/container might not be compatible.
- It complicates deployment - each micro-frontend/container has to be deployed and available to the clients (usually via Internet).
- It complicates release management - you need to make sure micro-frontend/container are as much isolated as possible and not co-dependent on each other, otherwise you need to make sure that dependent micro-frontend/container are released altogether.
- ... - there might be more challenges, depending on your use-case, internal processes, policies and specifics of your project.

:::tip

We always recommend to create a prototype or a Proof-of-Concept application, to better understand the challenges and forsee potential problems and effort needed to adopt Module Federation.

:::

### Limitations

Here's a list of currently know limitations:

- React Native requires JavaScript code to synchronously perform initialization, meaning React and React Native must be available in the main bundle. In practice, this means they must be `eager` and a `singleton`.
- The host application (the application usually released to the stores) needs to perform React and React Native initialization - some of the code will have to be baked into the application, it's not possible to load **all** of the JavaScript code dynamically.

:::tip

You should also consider limitations and T&C of the store you would be deploying the application to. You can read more on [Code Splitting page](./code-splitting/concept) - the same limitations and caveats apply.

:::

## Example

You can explore Module Federation example of React Native application using Re.Pack here: https://github.com/callstack/repack-examples/tree/main/module-federation.

## How to use Module Federation?

There are multiple resources available for you about Module Federation. They are specific to Web, but the same ideas apply when adopting Module Federation in React Native.

We suggest to go through the links below to get familiar with Module Federation for Web and then come back and compare differences between Module Federation on Web and in React Native:

- https://module-federation.github.io/blog/get-started
- https://indepth.dev/posts/1173/webpack-5-module-federation-a-game-changer-in-javascript-architecture
- https://ogzhanolguncu.com/blog/micro-frontends-with-module-federation
- https://medium.com/swlh/webpack-5-module-federation-a-game-changer-to-javascript-architecture-bcdd30e02669
- https://module-federation.github.io/videos
- https://github.com/module-federation/module-federation-examples

:::tip

Before adopting Module Federation in React Native, we recommend to create a Web-based prototype and then, integrate it into a React Native project with React Native specifics.

:::

## Custom Module Federation plugin

Re.Pack provides custom Module Federation plugin - [`Repack.plugin.ModuleFederationPlugin`](../api/repack/classes/plugins.ModuleFederationPlugin).

It's a recommended way to use Module Federation with Re.Pack. It provides defaults for `filename`, `library`, `shared` and converts `remotes` into `promise new Promise` loaders with [`Federated.createRemote` function](../api/repack/functions/Federated.createRemote) automatically.

For example a `host` config could look similar to:

```js
import * as Repack from '@callstack/repack';

// ...
new Repack.plugins.ModuleFederationPlugin({
  name: 'host',
});
```

And containers:

```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  name: 'app1',
  remotes: {
    module1: 'module1@https://example.com/module1.container.bundle',
  },
});

new Repack.plugins.ModuleFederationPlugin({
  name: 'app2',
  remotes: {
    module1: 'module1@https://example.com/module1.container.bundle',
    module2: 'module1@dynamic',
  },
});
```

## Static vs dynamic containers with Module Federation

In Module Federation with Re.Pack you can choose if you want to have containers loaded statically, dynamically or both.

### Dynamic containers with `Federated.importModule`

To load dynamic containers you can use [`Federated.importModule`](../api/repack/client/functions/Federated.importModule) and add a resolver for it and it's chunks, for example:

```js
import { ScriptManager, Script, Federated } from '@callstack/repack/client';

// Add resolver
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Create resolve function
  const resolveURL = Federated.createURLResolver({
    containers: {
      app1: 'https://somewhere1.com/[name][ext]',
    },
  });

  // Try to resolve URL based on scriptId and caller
  const url = resolveURL(scriptId, caller);
  if (url) {
    return { url };
  }
});

// Somewhere later...
// Load container, React.lazy is optional
const App1 = React.lazy(() => Federated.importModule('app1', './App'));
```

### Semi-Dynamic containers with `remotes`

Another way to load container is with `remotes`. You specify what containers will be used in `remotes`, but the URL resolution will be dynamic. Using `remotes` allows you to import containers using standard import statement (`import ... from '...';`).

In the code it could look similar to:

```js
import { ScriptManager, Script, Federated } from '@callstack/repack/client';

// Add resolver
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Create resolve function
  const resolveURL = Federated.createURLResolver({
    containers: {
      app1: 'https://somewhere1.com/[name][ext]',
    },
  });

  // Try to resolve URL based on scriptId and caller
  const url = resolveURL(scriptId, caller);
  if (url) {
    return { url };
  }
});

// Somewhere later...
import App1 from 'app1/App';

// use App1 somehow
```

And the `remotes` have to be configured inside [`Repack.plugin.ModuleFederationPlugin`](../api/repack/classes/plugins.ModuleFederationPlugin):

```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  name: '...',
  remotes: {
    module1: 'app1@dynamic',
  },
});
```

:::caution

Keep in mind, `remotes` cannot be used inside Host application: [Host application can't use `remotes`](#host-application-cant-use-remotes)

:::

### Static containers with `remotes`

This options is similar to [Semi-Dynamic containers with `remotes`](#semi-dynamic-containers-with-remotes) but doesn't require to manually provide resolver with [`ScriptManager.shared.addResolver`](../api/repack/client/classes/ScriptManager#addresolver). Instead, the URL for resolution is specified at build time inside `remotes`:

```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  name: '...',
  remotes: {
    module1: 'app1@https://example.com/app1.container.bundle',
  },
});
```

This will add a default resolver based on the URL after `@`, so you can import federated module without calling [`ScriptManager.shared.addResolver`](../api/repack/client/classes/ScriptManager#addresolver):

```js
// Somewhere later...
import App1 from 'app1/App';

// use App1 somehow
```

:::caution

Keep in mind, `remotes` cannot be used inside Host application: [Host application can't use `remotes`](#host-application-cant-use-remotes)

:::

## `ScriptManager`'s resolvers in Module Federation

In Module Federation setup, [`ScriptManager`](../api/repack/client/classes/ScriptManager) can be used in a similar way as you would use it with standard [Code Splitting](./code-splitting/usage).

The main difference is with resolvers:

- Containers can use `remotes` and provide URLs in plugin configuration (eg `module1@https://example.com/module1.container.bundle`) - this would add a default resolver for container `module1` and it's chunks.
- Containers can add new resolvers using [`ScriptManager.shared.addResolver`](../api/repack/client/classes/ScriptManager#addresolver) or
  a host application can provide resolver for containers.
- Async chunks of containers have to be accounted for - there has to be a resolver for e.g `src_App_js` chunk for container `app1` and a resolver for `src_App_js` for container `app2`.

### Single resolver in host

:::info

Relevant only when using dynamic/semi-dynamic containers.

:::

When using a single resolver in the host, we recommend to use [`Federated.createURLResolver`](../api/repack/client/functions/Federated.createURLResolver) to reduce boilerplate:

```js
import { ScriptManager, Script, Federated } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Create resolve function
  const resolveURL = Federated.createURLResolver({
    containers: {
      app1: 'https://somewhere1.com/[name][ext]',
      app2: 'https://somewhere2.com/[name].container.js',
    },
    chunks: {
      main: 'https://somewhere3.com/[name][ext]',
      app2: 'https://somewhere2.com/chunks/[name][ext]',
    },
  });

  // Try to resolve URL based on scriptId and caller
  const url = resolveURL(scriptId, caller);
  if (url) {
    return { url };
  }
});
```

The example above would resolve chunks and container according to the table below:

| `scriptId`      | `caller`    | `url`                                                     | Notes                       |
| --------------- | ----------- | --------------------------------------------------------- | --------------------------- |
| `'src_App_js'`  | `'main'`    | `'https://somewhere3.com/src_App_js.chunk.bundle'`        | Chunk of Host application   |
| `'src_Body_js'` | `'main'`    | `'https://somewhere3.com/src_Body_js.chunk.bundle'`       | Chunk of Host application   |
| `'app1'`        | `undefined` | `'https://somewhere1.com/app1.container.bundle'`          | Container entry             |
| `'src_App_js'`  | `'app1'`    | `'https://somewhere1.com/src_App_js.chunk.bundle'`        | Chunk of container `'app1'` |
| `'app2'`        | `undefined` | `'https://somewhere2.com/app2.container.js'`              | Container entry             |
| `'src_App_js'`  | `'app2'`    | `'https://somewhere2.com/chunks/src_App_js.chunk.bundle'` | Chunk of container `'app2'` |

### Multiple resolvers

:::info

Relevant only when using dynamic/semi-dynamic containers.

:::

With multiple resolvers you can call [`ScriptManager.shared.addResolver`](../api/repack/client/classes/ScriptManager#addresolver) multiple times in the Host application or have a dedicated resolver per container:

```js
// Host
import { ScriptManager, Script, Federated } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Resolve chunks of host application only
  if (caller === 'main') {
    return {
      url: Script.getRemoteURL(`https://somewhere3.com/${scriptId}`),
    };
  }

  // Resolve entry of app1 container and it's chunks
  if (scriptId === 'app1') {
    return {
      url: 'https://somewhere1.com/app1.container.bundle',
    };
  }
  if (caller === 'app1') {
    return {
      url: Script.getRemoteURL(`https://somewhere1.com/${scriptId}`),
    };
  }
});
```

```js
// app1 container
import { ScriptManager, Script, Federated } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Resolve entry of module1 container and it's chunks
  if (scriptId === 'module1') {
    return {
      url: 'https://somewhere4.com/module1.container.bundle',
    };
  }
  if (caller === 'module1') {
    return {
      url: Script.getRemoteURL(`https://somewhere4.com/${scriptId}`),
    };
  }
});
```

## Differences between Web and React Native

### Host application

In React Native project with Module Federation, there has to be a _Host_ application, also known as _Shell_.

A Host application is a React Native application, which is usually released to the stores as a final product, delivered to the customers/users.

There can be multiple host applications in single project, but each of these hosts must meet the following requirements:

- [React and React Native must be `eager` and `singleton`](#react-and-react-native-must-be-eager-and-singleton)
- [Host application must have native modules used in other containers](#host-application-must-have-native-modules-used-in-other-containers)
- [Host application can't use `remotes`](#host-application-cant-use-remotes)

### React and React Native must be `eager` and `singleton`

React Native requires a single instance of `react` and `react-native` dependency, otherwise the application crashes. On Web, usually you want to have `react` and `react-dom` shared, but they don't have to be `eager`.

The reason why `react` and `react-native` have to be `eager` in React Native is because the JavaScript context in React Native has to be initialized - the logic that sets up the environment lives inside `react-native`'s `InitializeCore.js`.
The initialization must be done as a first step and it has to be done synchronously before `AppRegistry.registerComponent()` is called.

In practice, this means that `react` and `react-native` must be configured inside `shared` as both `eager` and a `singleton` in all containers:

```js
/* ... */

import * as Repack from '@callstack/repack';

export default (env) => {
  /* ... */

  return {
    /* ... */

    plugins: [
      /* ... */

      new Repack.plugins.ModuleFederationPlugin({
        /* ... */

        shared: {
          react: Repack.plugins.SHARED_REACT, // Added by default
          'react-native': Repack.plugins.SHARED_REACT_NATIVE, // Added by default
        },
      }),
    ],
  };
};
```

### `import('./bootstrap')` is not supported

In many guides and tutorials, you will find `import('./bootstrap')` inside an entry file to an application (usually `index.{js,ts}`). This dynamic import, creates a async boundary and allows `react`/`react-dom` to be lazy and
it's a recommended way to deal with the `Uncaught Error: Shared module is not available for eager consumption` error (outlined in https://webpack.js.org/concepts/module-federation/#uncaught-error-shared-module-is-not-available-for-eager-consumption).
This works for Web, because DOM API provides functionalities to load and execute additional JavaScript code out of the box.

However, React Native doesn't provide any APIs to load additional code by default. The only way to execute additional code is to use native module to load it and evaluate on the native side. But, in order to use native modules, the bridge between JavaScript and native has to be established, which happens when React Native initializes the environment. In order words, only after React Native is initialized, it's possible to load and execute additional JavaScript code, which happens through [`ScriptManager`](../api/repack/client/classes/ScriptManager).

In practice, this means that your entry code should look similar to the following snippet:

```js
import { AppRegistry } from 'react-native';
import { ScriptManager, Script } from '@callstack/repack/client';
import App from './App';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // ...
});

AppRegistry.registerComponent('AppName', () => App);
```

This code can be place inside entry `<projectRoot>/index.js`, but we recommend to put it inside `<projectRoot>/src/bootstrap.{js,ts}` and use a synchronous import statement inside `<projectRoot>/index.js`:

```js
// index.js
import './src/bootstrap';
```

### Host application can't use `remotes`

Currently, there's a limitation for Host application preventing them from using `remotes` in [`Repack.plugins.ModuleFederationPlugin`](../api/repack/classes/plugins.ModuleFederationPlugin).

In order to load a container from the host, you have to use [`Federated.importModule`](../api/repack/client/functions/Federated.importModule):

```js
import * as React from 'react';
import { ScriptManager, Federated } from '@callstack/repack/client';

// Somewhere in the code before `Federated.importModule`,
// usually before `AppRegistry.registerComponent`
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Handle scriptId === 'app' and caller === 'app'
  // ...
});

const App = React.lazy(() => Federated.importModule('app', 'App.js'));
```

The code above, will load `app` container, import module `App.js` from it and pass it to `React.lazy`.

### Host application must have native modules used in other containers

If you're planning on using native modules, the host application must provide native code for those. It's also recommended to make those modules `shared` and a `singleton`.

For example, if you want to use `react-native-reanimated`, you must add it to the host all all the containers you want to use Reanimated in, then configure [`Repack.plugins.ModuleFederationPlugin`](../api/repack/classes/plugins.ModuleFederationPlugin) in host and the containers using the dependency:

```js
/* ... */

import * as Repack from '@callstack/repack';

export default (env) => {
  /* ... */

  return {
    /* ... */

    plugins: [
      /* ... */

      new Repack.plugins.ModuleFederationPlugin({
        /* ... */

        shared: {
          react: Repack.Federated.SHARED_REACT,
          'react-native': Repack.Federated.SHARED_REACT,
          'react-native-reanimated': {
            singleton: true,
          },
        },
      }),
    ],
  };
};
```

### `remotes` must use `Federated.createRemote(...)` function

:::tip

By using [`Repack.plugins.ModuleFederationPlugin`](../api/repack/classes/plugins.ModuleFederationPlugin), `remotes` will be automatically converted to `promise new Promise` using [`Federated.createRemote` function](../api/repack/functions/Federated.createRemote).

:::

:::info

Only relevant when not using `webpack.container.ModuleFederationPlugin` instead of [`Repack.plugins.ModuleFederationPlugin`](../api/repack/classes/plugins.ModuleFederationPlugin).

:::

[`ScriptManager`](../api/repack/client/classes/ScriptManager), which allows to load and evaluate additional JavaScript code (including containers), is an asynchronous API. This means the `remotes` in `ModuleFederationPlugin` must use `promise new Promise(...)` syntax. To avoid repetition and having to maintain `promise new Promise(...)` implementations yourself, Re.Pack provides an abstraction - [`Federated.createRemote` function](../api/repack/functions/Federated.createRemote):

```js
/* ... */

import { Federated } from '@callstack/repack';
import webpack from 'webpack';

export default (env) => {
  /* ... */

  return {
    /* ... */

    plugins: [
      /* ... */

      new webpack.container.ModuleFederationPlugin({
        /* ... */

        remotes: {
          app1: Federated.createRemote('app1@dynamic'),
          app2: Federated.createRemote('app2@dynamic'),
        },
      }),
    ],
  };
};
```

[`Federated.createRemote` function](../api/repack/functions/Federated.createRemote) will make the remote loadable, so you will be able to use import statement for `remotes`:

```js
import App1 from 'app1/App.js';
import App1 from 'app2/App.js';
```

The loading code generated by [`Federated.createRemote` function](../api/repack/functions/Federated.createRemote) uses [`ScriptManager`](../api/repack/client/classes/ScriptManager),
meaning you need to make sure the proper resolvers are added via [`ScriptManager.shared.addResolver`](../api/repack/client/classes/ScriptManager#addresolver) so your remotes can be resolved, for example:

```js
import { ScriptManager, Federated } from '@callstack/repack/client';

// Somewhere in the code, usually before `AppRegistry.registerComponent`
ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // Handle:
  //   - scriptId === 'app1' and caller === 'app1'
  //   - scriptId === 'app2' and caller === 'app2'
  // ...
});
```

## Public Path is unused

Re.Pack doesn't use public path and all chunk resolution as well as dynamic container resolution happens through resolvers added to [`ScriptManager`](../api/repack/client/classes/ScriptManager) via [`ScriptManager.shared.addResolver`](../api/repack/client/classes/ScriptManager#addresolver).
