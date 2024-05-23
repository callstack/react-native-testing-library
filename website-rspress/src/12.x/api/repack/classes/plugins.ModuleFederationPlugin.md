# Class: ModuleFederationPlugin

[plugins](../modules/plugins.md).ModuleFederationPlugin

Webpack plugin to configure Module Federation with platform differences
handled under the hood.

Usually, you should use `Repack.plugin.ModuleFederationPlugin`
instead of `webpack.container.ModuleFederationPlugin`.

`Repack.plugin.ModuleFederationPlugin` creates:
- default for `filename` option when `exposes` is defined
- default for `library` option when `exposes` is defined
- default for `shared` option with `react` and `react-native` dependencies
- converts `remotes` into `ScriptManager`-powered `promise new Promise` loaders

You can overwrite all defaults by passing respective options.

`remotes` will always be converted to ScriptManager`-powered `promise new Promise` loaders
using [Federated.createRemote](../functions/Federated.createRemote.md).

**`example`** Host example.
```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  name: 'host,
});
```

**`example`** Host example with additional `shared` dependencies.
```js
import * as Repack from '@callstack/repack';

new Repack.plugins.ModuleFederationPlugin({
  name: 'host,
  shared: {
    react: Repack.Federated.SHARED_REACT,
    'react-native': Repack.Federated.SHARED_REACT,
    'react-native-reanimated': {
      singleton: true,
    },
  },
});
```

**`example`** Container examples.
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

## Implements

- [`WebpackPlugin`](../interfaces/WebpackPlugin.md)

## Table of contents

### Constructors

- [constructor](./plugins.ModuleFederationPlugin.md#constructor)

### Methods

- [apply](./plugins.ModuleFederationPlugin.md#apply)

## Constructors

### constructor

• **new ModuleFederationPlugin**(`config`)

#### Parameters

| Name | Type |
| :------ | :------ |
| `config` | [`ModuleFederationPluginConfig`](../interfaces/plugins.ModuleFederationPluginConfig.md) |

#### Defined in

[packages/repack/src/webpack/plugins/ModuleFederationPlugin.ts:112](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ModuleFederationPlugin.ts#L112)

## Methods

### apply

▸ **apply**(`compiler`): `void`

Apply the plugin.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `compiler` | `Compiler` | Webpack compiler instance. |

#### Returns

`void`

#### Implementation of

[WebpackPlugin](../interfaces/WebpackPlugin.md).[apply](../interfaces/WebpackPlugin.md#apply)

#### Defined in

[packages/repack/src/webpack/plugins/ModuleFederationPlugin.ts:237](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ModuleFederationPlugin.ts#L237)
