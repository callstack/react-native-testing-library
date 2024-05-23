# Interface: ModuleFederationPluginConfig

[plugins](../modules/plugins.md).ModuleFederationPluginConfig

[ModuleFederationPlugin](../classes/plugins.ModuleFederationPlugin.md) configuration options.

The fields and types are exactly the same as in `webpack.container.ModuleFederationPlugin`.

You can check documentation for all supported options here: https://webpack.js.org/plugins/module-federation-plugin/

## Hierarchy

- `ModuleFederationPluginOptions`

  ↳ **`ModuleFederationPluginConfig`**

## Table of contents

### Properties

- [exposes](./plugins.ModuleFederationPluginConfig.md#exposes)
- [filename](./plugins.ModuleFederationPluginConfig.md#filename)
- [library](./plugins.ModuleFederationPluginConfig.md#library)
- [name](./plugins.ModuleFederationPluginConfig.md#name)
- [reactNativeDeepImports](./plugins.ModuleFederationPluginConfig.md#reactnativedeepimports)
- [remoteType](./plugins.ModuleFederationPluginConfig.md#remotetype)
- [remotes](./plugins.ModuleFederationPluginConfig.md#remotes)
- [runtime](./plugins.ModuleFederationPluginConfig.md#runtime)
- [shareScope](./plugins.ModuleFederationPluginConfig.md#sharescope)
- [shared](./plugins.ModuleFederationPluginConfig.md#shared)

## Properties

### exposes

• `Optional` **exposes**: `ExposesObject` \| (`string` \| `ExposesObject`)[]

Modules that should be exposed by this container. When provided, property name is used as public name, otherwise public name is automatically inferred from request.

#### Inherited from

ModuleFederationPluginOptions.exposes

#### Defined in

node_modules/webpack/types.d.ts:6955

___

### filename

• `Optional` **filename**: `string`

The filename of the container as relative path inside the `output.path` directory.

#### Inherited from

ModuleFederationPluginOptions.filename

#### Defined in

node_modules/webpack/types.d.ts:6960

___

### library

• `Optional` **library**: `LibraryOptions`

Options for library.

#### Inherited from

ModuleFederationPluginOptions.library

#### Defined in

node_modules/webpack/types.d.ts:6965

___

### name

• `Optional` **name**: `string`

The name of the container.

#### Inherited from

ModuleFederationPluginOptions.name

#### Defined in

node_modules/webpack/types.d.ts:6970

___

### reactNativeDeepImports

• `Optional` **reactNativeDeepImports**: `boolean`

Enable or disable adding React Native deep imports to shared dependencies

#### Defined in

[packages/repack/src/webpack/plugins/ModuleFederationPlugin.ts:43](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/ModuleFederationPlugin.ts#L43)

___

### remoteType

• `Optional` **remoteType**: ``"import"`` \| ``"var"`` \| ``"module"`` \| ``"assign"`` \| ``"this"`` \| ``"window"`` \| ``"self"`` \| ``"global"`` \| ``"commonjs"`` \| ``"commonjs2"`` \| ``"commonjs-module"`` \| ``"commonjs-static"`` \| ``"amd"`` \| ``"amd-require"`` \| ``"umd"`` \| ``"umd2"`` \| ``"jsonp"`` \| ``"system"`` \| ``"promise"`` \| ``"script"`` \| ``"node-commonjs"``

The external type of the remote containers.

#### Inherited from

ModuleFederationPluginOptions.remoteType

#### Defined in

node_modules/webpack/types.d.ts:6975

___

### remotes

• `Optional` **remotes**: `RemotesObject` \| (`string` \| `RemotesObject`)[]

Container locations and request scopes from which modules should be resolved and loaded at runtime. When provided, property name is used as request scope, otherwise request scope is automatically inferred from container location.

#### Inherited from

ModuleFederationPluginOptions.remotes

#### Defined in

node_modules/webpack/types.d.ts:7001

___

### runtime

• `Optional` **runtime**: `string` \| ``false``

The name of the runtime chunk. If set a runtime chunk with this name is created or an existing entrypoint is used as runtime.

#### Inherited from

ModuleFederationPluginOptions.runtime

#### Defined in

node_modules/webpack/types.d.ts:7006

___

### shareScope

• `Optional` **shareScope**: `string`

Share scope name used for all shared modules (defaults to 'default').

#### Inherited from

ModuleFederationPluginOptions.shareScope

#### Defined in

node_modules/webpack/types.d.ts:7011

___

### shared

• `Optional` **shared**: `SharedObject` \| (`string` \| `SharedObject`)[]

Modules that should be shared in the share scope. When provided, property names are used to match requested modules in this compilation.

#### Inherited from

ModuleFederationPluginOptions.shared

#### Defined in

node_modules/webpack/types.d.ts:7016
