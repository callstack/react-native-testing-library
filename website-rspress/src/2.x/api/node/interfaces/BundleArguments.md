# Interface: BundleArguments

CLI arguments passed from React Native CLI when running bundle command.

**`internal`**

## Hierarchy

- [`CommonArguments`](./CommonArguments.md)

  ↳ **`BundleArguments`**

## Table of contents

### Properties

- [assetsDest](./BundleArguments.md#assetsdest)
- [bundleOutput](./BundleArguments.md#bundleoutput)
- [dev](./BundleArguments.md#dev)
- [entryFile](./BundleArguments.md#entryfile)
- [minify](./BundleArguments.md#minify)
- [platform](./BundleArguments.md#platform)
- [resetCache](./BundleArguments.md#resetcache)
- [sourcemapOutput](./BundleArguments.md#sourcemapoutput)
- [verbose](./BundleArguments.md#verbose)
- [webpackConfig](./BundleArguments.md#webpackconfig)

## Properties

### assetsDest

• `Optional` **assetsDest**: `string`

#### Defined in

[packages/repack/src/types.ts:52](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L52)

___

### bundleOutput

• **bundleOutput**: `string`

#### Defined in

[packages/repack/src/types.ts:56](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L56)

___

### dev

• **dev**: `boolean`

#### Defined in

[packages/repack/src/types.ts:55](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L55)

___

### entryFile

• **entryFile**: `string`

#### Defined in

[packages/repack/src/types.ts:53](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L53)

___

### minify

• `Optional` **minify**: `boolean`

#### Defined in

[packages/repack/src/types.ts:54](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L54)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

[CommonArguments](./CommonArguments.md).[platform](./CommonArguments.md#platform)

#### Defined in

[packages/repack/src/types.ts:37](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L37)

___

### resetCache

• `Optional` **resetCache**: `boolean`

Whether to clean any persistent cache.

#### Inherited from

[CommonArguments](./CommonArguments.md).[resetCache](./CommonArguments.md#resetcache)

#### Defined in

[packages/repack/src/types.ts:39](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L39)

___

### sourcemapOutput

• `Optional` **sourcemapOutput**: `string`

#### Defined in

[packages/repack/src/types.ts:58](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L58)

___

### verbose

• `Optional` **verbose**: `boolean`

Whether to log additional debug messages.

#### Inherited from

[CommonArguments](./CommonArguments.md).[verbose](./CommonArguments.md#verbose)

#### Defined in

[packages/repack/src/types.ts:41](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L41)

___

### webpackConfig

• `Optional` **webpackConfig**: `string`

Custom path to Webpack config.

#### Inherited from

[CommonArguments](./CommonArguments.md).[webpackConfig](./CommonArguments.md#webpackconfig)

#### Defined in

[packages/repack/src/types.ts:43](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L43)
