# Function: createRemote

[Federated](../modules/Federated.md).createRemote

▸ **createRemote**(`remote`): `string`

Creates JavaScript loading code for the given Module Federation remote
allowing to import that remote without creating an async boundary, but with
simple import statement, eg: `import MyComponent from 'my-remote/MyComponent';`.

`Federated.createRemote` adds a default resolver for container and it's chunks
with priority `0`, if you provide URL after the `@`.
If `dynamic` (eg `module1@dynamic`) is provided, no default resolver will be added.

__This function should be used only when using `webpack.container.ModuleFederationPlugin`.__
For `Repack.plugins.ModuleFederationPlugin`, `Federated.createRemote` is used under the hood.

Remote container will be evaluated only once. If you import module from the same container twice,
the container will be loaded and evaluated only on the first import.

**`example`**
```ts
import webpack from 'webpack';
import * as Repack from '@callstack/repack';

export default (env) => {
  return {
    plugins: [
      new webpack.container.ModuleFederationPlugin({
        remotes: {
          app1: Repack.Federated.createRemote('app1@dynamic'),
          app2: Repack.Federated.createRemote('app2@https://example.com/app2.container.bundle'),
        },
      }),
    ],
  };
};
```

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `remote` | `string` | Remote name with URL or `dynamic` separated by `@`. |

#### Returns

`string`

A JavaScript loading code the the given remote.

#### Defined in

[packages/repack/src/webpack/federated.ts:115](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/federated.ts#L115)
