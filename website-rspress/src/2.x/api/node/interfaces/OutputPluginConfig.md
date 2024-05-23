# Interface: OutputPluginConfig

[OutputPlugin](../classes/OutputPlugin.md) configuration options.

## Table of contents

### Properties

- [devServerEnabled](./OutputPluginConfig.md#devserverenabled)
- [entry](./OutputPluginConfig.md#entry)
- [localChunks](./OutputPluginConfig.md#localchunks)
- [platform](./OutputPluginConfig.md#platform)
- [remoteChunksOutput](./OutputPluginConfig.md#remotechunksoutput)

## Properties

### devServerEnabled

• `Optional` **devServerEnabled**: `boolean`

Whether the development server is enabled and running.

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:14](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L14)

___

### entry

• `Optional` **entry**: `string`

The entry chunk name, 'main' by default.

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:30](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L30)

___

### localChunks

• `Optional` **localChunks**: [`Rule`](../types/Rule.md) \| [`Rule`](../types/Rule.md)[]

Mark all chunks as a local chunk, meaning they will be bundled into the `.ipa`/`.apk` file.
All chunks not matched by the rule(s) will become a remote one.

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:19](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L19)

___

### platform

• **platform**: `string`

Target application platform.

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:12](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L12)

___

### remoteChunksOutput

• `Optional` **remoteChunksOutput**: `string`

Output directory for all remote chunks and assets that are not bundled into
the `.ipa`/`.apk` file.
When left unspecified (`undefined`), the files will be available under `output.path`, next to
the main/index bundle and other local chunks.

#### Defined in

[packages/repack/src/webpack/plugins/OutputPlugin.ts:26](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/webpack/plugins/OutputPlugin.ts#L26)
