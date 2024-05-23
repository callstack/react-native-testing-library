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
- [json](./StartArguments.md#json)
- [key](./StartArguments.md#key)
- [logFile](./StartArguments.md#logfile)
- [platform](./StartArguments.md#platform)
- [port](./StartArguments.md#port)
- [resetCache](./StartArguments.md#resetcache)
- [reversePort](./StartArguments.md#reverseport)
- [silent](./StartArguments.md#silent)
- [verbose](./StartArguments.md#verbose)
- [webpackConfig](./StartArguments.md#webpackconfig)

## Properties

### cert

• `Optional` **cert**: `string`

#### Defined in

[packages/repack/src/types.ts:71](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L71)

___

### host

• `Optional` **host**: `string`

#### Defined in

[packages/repack/src/types.ts:72](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L72)

___

### https

• `Optional` **https**: `boolean`

#### Defined in

[packages/repack/src/types.ts:73](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L73)

___

### interactive

• `Optional` **interactive**: `boolean`

#### Defined in

[packages/repack/src/types.ts:76](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L76)

___

### json

• `Optional` **json**: `boolean`

#### Defined in

[packages/repack/src/types.ts:79](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L79)

___

### key

• `Optional` **key**: `string`

#### Defined in

[packages/repack/src/types.ts:74](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L74)

___

### logFile

• `Optional` **logFile**: `string`

#### Defined in

[packages/repack/src/types.ts:81](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L81)

___

### platform

• **platform**: `string`

Target application platform.

#### Inherited from

[CommonArguments](./CommonArguments.md).[platform](./CommonArguments.md#platform)

#### Defined in

[packages/repack/src/types.ts:37](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L37)

___

### port

• `Optional` **port**: `number`

#### Defined in

[packages/repack/src/types.ts:75](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L75)

___

### resetCache

• `Optional` **resetCache**: `boolean`

Whether to clean any persistent cache.

#### Inherited from

[CommonArguments](./CommonArguments.md).[resetCache](./CommonArguments.md#resetcache)

#### Defined in

[packages/repack/src/types.ts:39](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L39)

___

### reversePort

• `Optional` **reversePort**: `boolean`

#### Defined in

[packages/repack/src/types.ts:80](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L80)

___

### silent

• `Optional` **silent**: `boolean`

#### Defined in

[packages/repack/src/types.ts:77](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L77)

___

### verbose

• `Optional` **verbose**: `boolean`

Whether to log additional debug messages.

#### Overrides

[CommonArguments](./CommonArguments.md).[verbose](./CommonArguments.md#verbose)

#### Defined in

[packages/repack/src/types.ts:78](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L78)

___

### webpackConfig

• `Optional` **webpackConfig**: `string`

Custom path to Webpack config.

#### Inherited from

[CommonArguments](./CommonArguments.md).[webpackConfig](./CommonArguments.md#webpackconfig)

#### Defined in

[packages/repack/src/types.ts:43](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/types.ts#L43)
