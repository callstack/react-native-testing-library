# Interface: CodeSigningPluginConfig

[plugins](../modules/plugins.md).CodeSigningPluginConfig

[CodeSigningPlugin](../classes/plugins.CodeSigningPlugin.md) configuration options.

## Table of contents

### Properties

- [enabled](./plugins.CodeSigningPluginConfig.md#enabled)
- [excludeChunks](./plugins.CodeSigningPluginConfig.md#excludechunks)
- [outputPath](./plugins.CodeSigningPluginConfig.md#outputpath)
- [privateKeyPath](./plugins.CodeSigningPluginConfig.md#privatekeypath)

## Properties

### enabled

• `Optional` **enabled**: `boolean`

Whether the plugin is enabled. Defaults to true

#### Defined in

[packages/repack/src/webpack/plugins/CodeSigningPlugin.ts:13](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/CodeSigningPlugin.ts#L13)

___

### excludeChunks

• `Optional` **excludeChunks**: `string`[]

Names of chunks to exclude from being signed.

#### Defined in

[packages/repack/src/webpack/plugins/CodeSigningPlugin.ts:19](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/CodeSigningPlugin.ts#L19)

___

### outputPath

• **outputPath**: `string`

Output path to a directory, where signed bundles should be saved.

#### Defined in

[packages/repack/src/webpack/plugins/CodeSigningPlugin.ts:15](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/CodeSigningPlugin.ts#L15)

___

### privateKeyPath

• **privateKeyPath**: `string`

Path to the private key.

#### Defined in

[packages/repack/src/webpack/plugins/CodeSigningPlugin.ts:17](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/webpack/plugins/CodeSigningPlugin.ts#L17)
