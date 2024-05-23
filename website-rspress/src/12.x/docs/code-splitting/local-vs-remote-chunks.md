# Local vs Remote chunks

Each chunk created by using dynamic `import(...)` function can be either remote or a local chunk.

__By default all chunks are remote.__

## Chunk naming

Regardless of the chunk's type, it's important to understand how chunks are named.

:::info

Chunk naming is handled solely by Webpack. Re.Pack does not alter or customize chunk names in any way.

:::

By default, chunk name is inferred by Webpack based on the source filename. For example if you have a file
`./src/Button.js`, the inferred name would be `src_Button_js`. This human-readable chunk name will only be used
in development though. By default, Webpack in production, minimizes chunk names to numbers to save space,
meaning `src_Button_js` chunk in production might look like `137`.

This behavior is fine for Web, but in React Native with `ScriptManager`, it's not ideal, because we don't know what
this number will be in production.

There are 2 options to address this problem:

1. Set [`optimization.chunkIds`](https://webpack.js.org/configuration/optimization/#optimizationchunkids) option to `named` in Webpack config.
1. Use `/* webpackChunkName: "<name>" */` magic comment in `import(...)`.

:::tip

You can use both `optimization.chunkIds` and `webpackChunkName` comment at the same time. They are not mutually exclusive.

:::

:::tip

Chunk extension can be configured in [`output.chunkFilename`](https://webpack.js.org/configuration/output/#outputchunkfilename), which is set to `.chunk.bundle` by default.
It's usually __not__ necessary to modify it.

:::


### Named `chunkIds` config option

Setting [`optimization.chunkIds`](https://webpack.js.org/configuration/optimization/#optimizationchunkids) option to `named` in your Webpack config will
force Webpack to always use the human-readable form for the name of the chunks.

:::info

In version `3.x`, Re.Pack's templates for Webpack config have `chunkIds` is set to `named` by default.

:::

```js
/* ... */

export default (env) => {
  /* ... */

  return {
    /* ... */

    optimization: {
      /* ... */

      chunkIds: 'named',
    },

    /* ... */
  };
}
```

:::tip

Keep in mind that, `webpackChunkName` magic comment will always take precedence, so even if you have `chunkIds: 'named'`, Webpack will use name in `webpackChunkName`
comment for that chunk instead of the inferred one.

:::

### `webpackChunkName` magic comment

`webpackChunkName` magic comment allows you to provide your own custom name that should be used for the chunk when calling `import(...)` function:

```js
import(/* webpackChunkName: "button" */ './Button');
```

This example will result in chunk being named `button`, so the filename with extension will be `button.chunk.bundle`.

:::tip

You can use `webpackChunkName` magic comment to provide your custom name, regardless of the `optimization.chunkIds` option.
`webpackChunkName` will always take precedence.

:::

## Remote chunks

By default all chunks are remote chunks, meaning they are not bundled into the application and will be downloaded from the remote location (usually the Internet) on demand.
This helps with reducing the initial application size, especially if you have logic or features that only a subset of users will use - it doesn't make sense for everyone else
to always have to download the code (together with the application) they won't need.

All remote chunks are stored under `<projectRoot>/build/output/<platform>/remotes` by default. For example if `button.chunk.bundle` is a remote chunk, it will be stored under:
`<projectRoot>/build/output/ios/remotes/button.chunk.bundle` for iOS.

You can customize this by providing [`extraChunks`](../../api/repack/interfaces/plugins.OutputPluginConfig#extrachunks) to [`RepackPlugin`](../../api/repack/classes/RepackPlugin) or [`OutputPlugin`](../../api/repack/classes/plugins.OutputPlugin) (if you're not using `RepackPlugin`):

```js
/* ... */

export default (env) => {
  /* ... */

  return {
    /* ... */

    plugins: [
      new Repack.RepackPlugin({
        /* ... */

        extraChunks: [
          {
            test: /.*/,
            type: 'remote',
            outputPath: path.join('my/custom/path'),
          },
        ],
      }),
    ],
  };
};
```

This example, will mark all chunks as remote ones and store them under `<projectRoot>/my/custom/path`.

If `outputPath` in `extraChunks` is a relative path, it will be joined with the value of `context` property, which is set to root directory of your project by default.
You can also provide an absolute path, in which case, it won't be modified in any way and used as is.

:::tip

You can provide multiple `type: 'remote'` specs - see [Advanced example](#advanced-example) for more info.

:::

## Local chunks

In some situations, having chunks as remote ones is not ideal. For example, if you know that majority of the users will need a specific chunk you can mark it as local.

Local chunks will always be included in the final application (`.ipa` or `.apk`) file alongside main bundle. This can save mobile data usage and make your application feel
faster (in cases where network connection is degraded), but you will still benefit from improved startup, because the JavaScript engine will defer parsing and evaluation of
local chunks until they are actually needed.

:::tip

If you're using Hermes and you compile your code into bytecode bundles, it's better __not__ to use local chunks and instead make the code a part of the main bundle.

Using __local__ chunks with Hermes and bytecode bundles, will likely result __in worse performance__.

:::

You can customize which chunk should be local by providing [`extraChunks`](../../api/repack/interfaces/plugins.OutputPluginConfig#extrachunks) option in [`RepackPlugin`](../../api/repack/classes/RepackPlugin) or [`OutputPlugin`](../../api/repack/classes/plugins.OutputPlugin) (if you're not using `RepackPlugin`) configuration:

```js
/* ... */

export default (env) => {
  /* ... */

  return {
    /* ... */

    plugins: [
      new Repack.RepackPlugin({
        /* ... */

        extraChunks: [
          {
            include: /^.+\.local$/,
            type: 'local',
          },
          {
            // IMPORTANT!
            exclude: /^.+\.local$/,
            type: 'remote',
            outputPath: path.join('build/output', platform, 'remote'), // Default path
          },
        ],
      }),
    ],
  };
};
```

The example above will make all chunks matching the RegExp `/^.+\.local$/` a local chunks, for example `student.local` (`student.local.chunk.bundle`) will be a local chunk, whereas everything else will become a remote.

:::warning

Specifying `extraChunks` will override any defaults - you must configure `remote` chunks yourself as well, otherwise they won't be stored anywhere!

:::

Once you have some chunks as local, you need to alter the resolver in [`ScriptManager.shared.addResolver`](../../api/repack/client/classes/ScriptManager#addresolver):

```js
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId) => {
  // In development, get all the chunks from dev server.
  if (__DEV__) {
    return {
      url: Script.getDevServerURL(scriptId),
      cache: false,
    };
  }

  // In production, get chunks matching the regex from filesystem.
  if (/^.+\.local$/.test(scriptId)) {
    return {
      url: Script.getFileSystemURL(scriptId),
    };
  } else {
    return {
      url: Script.getRemoteURL(`https://my-domain.dev/${scriptId}`),
    };
  }
});
```

:::tip

To avoid having to repeat the RegExp, you can create a new `.js` or `.json` file, export the RegExp and use the file both in the source code as well as in the Webpack config.

Check out the [`local-chunks` example](https://github.com/callstack/repack-examples) for concrete implementation.

:::

## Advanced example

You can mix multiple `type: 'local'` and `type: 'remote'` specs using `test`, `include` and `exclude` to match different chunks:

```js
/* ... */

export default (env) => {
  /* ... */

  return {
    /* ... */

    plugins: [
      new Repack.RepackPlugin({
        /* ... */

        extraChunks: [
          {
            // Make all student related chunks local.
            include: ['student', /^student-.+$/],
            type: 'local',
          },
          {
            // Anything not student related should be remote and stored under
            // `<projectRoot>/build/output/<platform>/remotes/core`.
            exclude: /^student-.+$/,
            type: 'remote',
            outputPath: path.join('build/output', platform, 'remotes/core'),
          },
          {
            // All teacher related chunks should be remote and stored under
            // `<projectRoot>/build/output/<platform>/remotes/teacher`.
            test: /^teacher.*$/,
            type: 'remote',
            outputPath: path.join('build/output', platform, 'remotes/teacher'),
          },
        ],
      }),
    ],
  };
};
```

Use the table below for examples, how the config above would treat different chunks:

| Name                   | `type`   | `outputPath`                                            |
|------------------------|----------|---------------------------------------------------------|
| `student`              | `local`  | -                                                       |
| `student-extensions`   | `local`  | -                                                       |
| `components`           | `remote` | `<projectRoot>/build/output/<platform>/remotes/core`    |
| `utils`                | `remote` | `<projectRoot>/build/output/<platform>/remotes/core`    |
| `teacher`              | `remote` | `<projectRoot>/build/output/<platform>/remotes/teacher` |
| `teacher-affiliations` | `remote` | `<projectRoot>/build/output/<platform>/remotes/teacher` |

:::tip

`test`, `include` and `exclude` properties behave in the same way as those in [Webpack's loader rules](https://webpack.js.org/configuration/module/#rule-conditions):

- `test: string | RegExp | Array<string | RegExp>` must match if specified
- `include: string | RegExp | Array<string | RegExp>` must match if specified
- `exclude: string | RegExp | Array<string | RegExp>` must __not__ match if specified

:::

