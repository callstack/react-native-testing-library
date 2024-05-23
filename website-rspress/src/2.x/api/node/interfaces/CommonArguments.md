# Interface: CommonArguments

Common CLI arguments that are used across all commands.

**`internal`**

## Hierarchy

- **`CommonArguments`**

  ↳ [`BundleArguments`](./BundleArguments.md)

  ↳ [`StartArguments`](./StartArguments.md)

## Table of contents

### Properties

- [platform](./CommonArguments.md#platform)
- [resetCache](./CommonArguments.md#resetcache)
- [verbose](./CommonArguments.md#verbose)
- [webpackConfig](./CommonArguments.md#webpackconfig)

## Properties

### platform

• **platform**: `string`

Target application platform.

#### Defined in

[packages/repack/src/types.ts:37](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L37)

___

### resetCache

• `Optional` **resetCache**: `boolean`

Whether to clean any persistent cache.

#### Defined in

[packages/repack/src/types.ts:39](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L39)

___

### verbose

• `Optional` **verbose**: `boolean`

Whether to log additional debug messages.

#### Defined in

[packages/repack/src/types.ts:41](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L41)

___

### webpackConfig

• `Optional` **webpackConfig**: `string`

Custom path to Webpack config.

#### Defined in

[packages/repack/src/types.ts:43](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L43)
