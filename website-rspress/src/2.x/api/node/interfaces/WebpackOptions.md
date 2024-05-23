# Interface: WebpackOptions

Represents all relevant options that are needed to create a valid Webpack configuration
and configure all plugins.

This is the return type of {@link parseCliOptions}.

## Table of contents

### Properties

- [context](./WebpackOptions.md#context)
- [dev](./WebpackOptions.md#dev)
- [devServer](./WebpackOptions.md#devserver)
- [entry](./WebpackOptions.md#entry)
- [minimize](./WebpackOptions.md#minimize)
- [mode](./WebpackOptions.md#mode)
- [outputFilename](./WebpackOptions.md#outputfilename)
- [outputPath](./WebpackOptions.md#outputpath)
- [platform](./WebpackOptions.md#platform)
- [reactNativePath](./WebpackOptions.md#reactnativepath)
- [sourcemapFilename](./WebpackOptions.md#sourcemapfilename)

## Properties

### context

• **context**: `string`

Context in which all resolution happens. Usually it's project root directory.

#### Defined in

[packages/repack/src/types.ts:137](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L137)

___

### dev

• **dev**: `boolean`

Inferred from [mode](./WebpackOptions.md#mode). `true` is `mode` is `development`.

#### Defined in

[packages/repack/src/types.ts:133](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L133)

___

### devServer

• `Optional` **devServer**: [`DevServerOptions`](./DevServerOptions.md)

Development server configuration options.
Used by [DevServerPlugin](../classes/DevServerPlugin.md), [BaseDevServer](../classes/BaseDevServer.md), [DevServer](../classes/DevServer.md) and [DevServerProxy](../classes/DevServerProxy.md).

If `undefined`, then development server should not be run.

#### Defined in

[packages/repack/src/types.ts:159](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L159)

___

### entry

• **entry**: `string`

Input filename - entry point of the bundle.

#### Defined in

[packages/repack/src/types.ts:139](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L139)

___

### minimize

• **minimize**: `boolean`

Whether to minimize the final bundle.

#### Defined in

[packages/repack/src/types.ts:150](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L150)

___

### mode

• **mode**: ``"production"`` \| ``"development"``

Compilation mode.

#### Defined in

[packages/repack/src/types.ts:131](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L131)

___

### outputFilename

• **outputFilename**: `string`

Bundle output filename - name under which built bundle will be saved.

#### Defined in

[packages/repack/src/types.ts:143](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L143)

___

### outputPath

• **outputPath**: `string`

Bundle output path - directory where built bundle will be saved.

#### Defined in

[packages/repack/src/types.ts:141](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L141)

___

### platform

• **platform**: `string`

Target application platform.

#### Defined in

[packages/repack/src/types.ts:135](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L135)

___

### reactNativePath

• **reactNativePath**: `string`

Path to React Native dependency. Usually points to `node_modules/react-native`.

#### Defined in

[packages/repack/src/types.ts:152](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L152)

___

### sourcemapFilename

• `Optional` **sourcemapFilename**: `string`

Source map filename - name under which generated Source Map will be saved.
The output directory for the Source Map is the same as [outputPath](./WebpackOptions.md#outputpath).

#### Defined in

[packages/repack/src/types.ts:148](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L148)
