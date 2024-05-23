# Interface: WebpackEnvOptions

Represents all relevant options that are passed to Webpack config function,
needed to create a valid Webpack configuration and configure all plugins.

This is the return type of {@link parseCliOptions}.

## Table of contents

### Properties

- [assetsPath](./WebpackEnvOptions.md#assetspath)
- [bundleFilename](./WebpackEnvOptions.md#bundlefilename)
- [context](./WebpackEnvOptions.md#context)
- [devServer](./WebpackEnvOptions.md#devserver)
- [entry](./WebpackEnvOptions.md#entry)
- [minimize](./WebpackEnvOptions.md#minimize)
- [mode](./WebpackEnvOptions.md#mode)
- [platform](./WebpackEnvOptions.md#platform)
- [reactNativePath](./WebpackEnvOptions.md#reactnativepath)
- [sourceMapFilename](./WebpackEnvOptions.md#sourcemapfilename)

## Properties

### assetsPath

• `Optional` **assetsPath**: `string`

Assets output path - directory where generated static assets will be saved.

#### Defined in

[packages/repack/src/types.ts:161](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L161)

___

### bundleFilename

• `Optional` **bundleFilename**: `string`

Bundle output filename - name under which generated bundle will be saved.

#### Defined in

[packages/repack/src/types.ts:153](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L153)

___

### context

• `Optional` **context**: `string`

Context in which all resolution happens. Usually it's project root directory.

#### Defined in

[packages/repack/src/types.ts:147](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L147)

___

### devServer

• `Optional` **devServer**: [`DevServerOptions`](./DevServerOptions.md)

Development server configuration options.
Used to configure `@callstack/repack-dev-server`.

If `undefined`, then development server should not be run.

#### Defined in

[packages/repack/src/types.ts:175](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L175)

___

### entry

• `Optional` **entry**: `string`

Input filename - entry point of the bundle.

#### Defined in

[packages/repack/src/types.ts:150](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L150)

___

### minimize

• `Optional` **minimize**: `boolean`

Whether to minimize the final bundle.

#### Defined in

[packages/repack/src/types.ts:164](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L164)

___

### mode

• `Optional` **mode**: ``"development"`` \| ``"production"``

Compilation mode.

#### Defined in

[packages/repack/src/types.ts:141](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L141)

___

### platform

• `Optional` **platform**: `string`

Target application platform.

#### Defined in

[packages/repack/src/types.ts:144](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L144)

___

### reactNativePath

• `Optional` **reactNativePath**: `string`

Path to React Native dependency. Usually points to `node_modules/react-native`.

#### Defined in

[packages/repack/src/types.ts:167](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L167)

___

### sourceMapFilename

• `Optional` **sourceMapFilename**: `string`

Source map filename - name under which generated source map (for the main bundle) will be saved.

#### Defined in

[packages/repack/src/types.ts:158](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L158)
