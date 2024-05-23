# Interface: StartArguments

CLI arguments passed from React Native CLI when running start command.

**`internal`**

## Hierarchy

- [`CommonArguments`](./CommonArguments.md)

  ↳ **`StartArguments`**

## Table of contents

### Properties

- [cert](./StartArguments.md#cert)
- [host](./StartArguments.md#host)
- [https](./StartArguments.md#https)
- [interactive](./StartArguments.md#interactive)
- [key](./StartArguments.md#key)
- [platform](./StartArguments.md#platform)
- [port](./StartArguments.md#port)
- [resetCache](./StartArguments.md#resetcache)
- [verbose](./StartArguments.md#verbose)
- [webpackConfig](./StartArguments.md#webpackconfig)

## Properties

### cert

• `Optional` **cert**: `string`

#### Defined in

[packages/repack/src/types.ts:69](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L69)

___

### host

• `Optional` **host**: `string`

#### Defined in

[packages/repack/src/types.ts:70](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L70)

___

### https

• `Optional` **https**: `boolean`

#### Defined in

[packages/repack/src/types.ts:71](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L71)

___

### interactive

• `Optional` **interactive**: `boolean`

#### Defined in

[packages/repack/src/types.ts:74](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L74)

___

### key

• `Optional` **key**: `string`

#### Defined in

[packages/repack/src/types.ts:72](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L72)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

[CommonArguments](./CommonArguments.md).[platform](./CommonArguments.md#platform)

#### Defined in

[packages/repack/src/types.ts:37](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L37)

___

### port

• `Optional` **port**: `number`

#### Defined in

[packages/repack/src/types.ts:73](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L73)

___

### resetCache

• `Optional` **resetCache**: `boolean`

Whether to clean any persistent cache.

#### Inherited from

[CommonArguments](./CommonArguments.md).[resetCache](./CommonArguments.md#resetcache)

#### Defined in

[packages/repack/src/types.ts:39](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/types.ts#L39)

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
