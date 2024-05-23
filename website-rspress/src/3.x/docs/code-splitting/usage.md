# Usage

The specific implementation of Code Splitting in your application can be different and should account for your project's specific needs, requirements and limitations.

In general, we can identify 3 main categories of implementation. All of those approaches are based on the same underlying mechanism: Re.Pack's [`ScriptManager`](../../api/repack/client/classes/ScriptManager) and the native module for it.

:::caution

Because Code Splitting support is based on the native module, you need to be able to compile the native code in your project, meaning you cannot use it with Expo.

It might be possible to use it in an ejected Expo app, but that scenario is not officially supported.

:::

:::tip

Use [Glossary of terms](./glossary) to better understand the content of this documentation.

:::

## Generic usage

On a high-level, all functionalities that enable usage of Webpack's Code Splitting, are powered by
Re.Pack's [`ScriptManager`](../../api/repack/client/classes/ScriptManager), which consists of the JavaScript part and the native part.

The [`ScriptManager`](../../api/repack/client/classes/ScriptManager) has methods which allows to:

1. Download and execute script - [`loadScript`](../../api/repack/client/classes/ScriptManager#loadscript)
2. Prefetch script (without executing immediately) - [`prefetchScript`](../../api/repack/client/classes/ScriptManager#prefetchscript)
3. Resolve script location - [`resolveScript`](../../api/repack/client/classes/ScriptManager#resolvescript)
4. Invalidate cache - [`invalidateScripts`](../../api/repack/client/classes/ScriptManager#invalidatescripts)

In order to provide this functionalities, a resolver has to be added using [`ScriptManager.shared.addResolver`](../../api/repack/client/classes/ScriptManager#addresolver):

```ts
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId, caller) => {
  // In dev mode, resolve script location to dev server.
  if (__DEV__) {
    return {
      url: Script.getDevServerURL(scriptId),
      cache: false,
    };
  }

  return {
    url: Script.getRemoteURL(
      `http://somewhere-on-the-internet.com/${scriptId}`
    ),
  };
});
```

If the `storage` is provided, the returned `url` from `resolve` will be used for cache management.
You can read more about it in [Caching and Versioning](./caching-versioning).

:::info

Do not instantiate `ScriptManager` yourself - use `ScriptManager.shared` to get access to an instance.

:::

Under the hood, the way a script gets loaded can be summarized as follows:

1. `ScriptManager.shared.loadScript(...)` gets called, either:
   - Automatically by the dynamic `import(...)` function handled by Webpack, when using [Async chunks approach](#async-chunks)
   - Manually when using [Scripts approach](#scripts) or [Module Federation](#module-federation)
2. `ScriptManager.shared.loadScript(...)` is called `scriptId` and `caller` arguments, which are either provided by:
   - Webpack, based on it's internal naming logic or a [magic comment: `webpackChunkName`](https://webpack.js.org/migrate/5/#using--webpackchunkname--)
   - Manually
3. `ScriptManager.shared.loadScript(...)` resolves the chunk location using `ScriptManager.shared.resolveScript(...)`.
4. The resolved location is compared against previous location of that script, if and only if, `storage` was provided and the script was resolved before.
5. The resolved location is passed to the native module, which downloads if necessary and executes the script.
6. Once the code has been executed the `Promise` returned by `ScriptManager.shared.loadScript(...)` gets resolved.

:::info

[`ScriptManager.shared.prefetchScript(...)`](../../api/repack/client/classes/ScriptManager#prefetchscript) follows
the same behavior except for #6, where it only downloads the file and doesn't execute it.

:::

## Approaches

There are generally 3 approaches to Code Splitting with Webpack and Re.Pack. Keep in mind that the
actual code you will have to create might be slightly different, depending on your project's
requirements, needs and limitations.

Those approaches should be used as a base for your Code Splitting implementation.

:::tip

It's recommended to read [Generic usage](#generic-usage) first, to understand it on a high-level and
get the necessary context.

:::

### Async chunks

Async chunks (or asynchronous chunks) are the easiest Code Splitting approach. They are usually
created by using dynamic `import(...)` function, which makes them extremely easy to introduce it
into the codebase.

The async chunks are created alongside the main bundle as part of a single
Webpack compilation, making it a great choice for a modular applications where all the code is
developed in-house.

The usage of async chunks essentially boils down to calling `import(...)` in your code, for example:

```js
const myChunk = await import('./myChunk.js');
```

Async chunks created by dynamic `import(...)` function can be nicely integrated using `React.lazy`
and `React.Suspense`:

```jsx
// MyChunk.js
export default function MyChunk(props) {
  return /* ... */;
}

// App.js
const MyChunk = React.lazy(() => import('./MyChunk.js'));

function App() {
  return (
    <React.Suspense fallback={<Text>Loading...</Text>}>
      <MyChunk /* someProp="someValue" */ />
    </React.Suspense>
  );
}
```

For each file in the dynamic `import(...)` function a new chunk will be created - those chunks will
be remote chunks by default.

:::tip

You can learn more about local and remote chunks in the dedicated [Local vs Remote chunks guide](./local-vs-remote-chunks).

:::

:::tip

To learn more or use async chunks in your project, check out our [dedicated Async chunks guide](./guide-async-chunks).

:::

:::tip

To see `import(...)`, `React.lazy` and `React.Suspense` in action, check out
[Re.Pack's `TesterApp`](https://github.com/callstack/repack/blob/main/packages/TesterApp/src/asyncChunks/AsyncContainer.tsx).

:::

:::caution

Don't forget to add resolver using [`ScriptManager.shared.addResolver`](../../api/repack/client/classes/ScriptManager#addresolver)!

:::

### Scripts

This approach allows to execute arbitrary code in your React Native application.
It's a similar concept as adding a new `<script>` element to a Web page.

Those scripts can be written in-house or externally, bundled using Webpack or a different bundler.
This also means that scripts can be created as part of separate Webpack compilations, or separate
build pipelines, from separate codebases and repositories.

:::warning

Scripts should only be used by advanced users with deep Webpack knowledge and experience.

Scripts give a lot of flexibility but it also means the support for them is limited. It's not possible for Re.Pack's
contributors to support all potential setups using this approach.

:::

:::caution

Beware, with dynamic scripts **there's no dependency sharing by default**. If you want your scripts
to reuse existing dependencies from the main bundle, it's up to you to figure out how to do it.
A good starting point would be:

- https://webpack.js.org/configuration/externals/
- https://webpack.js.org/plugins/dll-plugin/

:::

Loading a script is as simple as running a single function:

```js
await ScriptManager.shared.loadScript('my-script');
console.log('Script loaded');
```

And adding a resolver to the [`ScriptManager`](../../api/repack/client/classes/ScriptManager#addResolver) to resolve your
scripts:

```js
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId) => {
  if (scriptId === 'my-script') {
    return {
      url: Script.getRemoteURL('https://my-domain.dev/my-script.js', {
        excludeExtension: true,
      }),
    };
  }
});
```

### Module Federation

Use [Module Federation](../module-federation) document for information on adoption of Module Federation in React Native projects with Re.Pack.
