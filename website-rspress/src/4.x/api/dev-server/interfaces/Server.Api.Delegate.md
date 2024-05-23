# Interface: Delegate

[Server](../modules/Server.md).[Api](../modules/Server.Api.md).Delegate

Delegate with implementation for API endpoints.

## Table of contents

### Methods

- [getAssets](./Server.Api.Delegate.md#getassets)
- [getCompilationStats](./Server.Api.Delegate.md#getcompilationstats)
- [getPlatforms](./Server.Api.Delegate.md#getplatforms)

## Methods

### getAssets

▸ **getAssets**(`platform`): `Promise`<[`Asset`](./Server.Api.Asset.md)[]\>

Get all assets from compilation for given platform.
Should return `[]` if the compilation does not exists for given platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | `string` |

#### Returns

`Promise`<[`Asset`](./Server.Api.Asset.md)[]\>

#### Defined in

[types.ts:162](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L162)

___

### getCompilationStats

▸ **getCompilationStats**(`platform`): `Promise`<``null`` \| [`CompilationStats`](./Server.Api.CompilationStats.md)\>

Get compilation stats for a given platform.
Should return `null` if the compilation does not exists for given platform.

#### Parameters

| Name | Type |
| :------ | :------ |
| `platform` | `string` |

#### Returns

`Promise`<``null`` \| [`CompilationStats`](./Server.Api.CompilationStats.md)\>

#### Defined in

[types.ts:168](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L168)

___

### getPlatforms

▸ **getPlatforms**(): `Promise`<`string`[]\>

Get all platforms - either with already existing compilations or all supported platforms.

#### Returns

`Promise`<`string`[]\>

#### Defined in

[types.ts:156](https://github.com/callstack/repack/blob/1d9a1bb/packages/dev-server/src/types.ts#L156)
