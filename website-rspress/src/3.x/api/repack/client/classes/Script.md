# Class: Script

Representation of a Script to load and execute, used by [ScriptManager](./ScriptManager.md).

When adding resolvers to `ScriptManager` in `ScriptManager.shared.addResolver(...)`, you can use
`Script.getDevServerURL(...)`, `Script.getFileSystemURL(...)` or `Script.getRemoteURL(...)`
to create a `url` for the script.

Other methods are designed for internal use only.

## Table of contents

### Constructors

- [constructor](./Script.md#constructor)

### Properties

- [cache](./Script.md#cache)
- [caller](./Script.md#caller)
- [locator](./Script.md#locator)
- [scriptId](./Script.md#scriptid)
- [DEFAULT\_TIMEOUT](./Script.md#default_timeout)

### Methods

- [checkIfCacheDataOutdated](./Script.md#checkifcachedataoutdated)
- [getCacheData](./Script.md#getcachedata)
- [shouldRefetch](./Script.md#shouldrefetch)
- [shouldUpdateCache](./Script.md#shouldupdatecache)
- [toObject](./Script.md#toobject)
- [from](./Script.md#from)
- [getDevServerURL](./Script.md#getdevserverurl)
- [getFileSystemURL](./Script.md#getfilesystemurl)
- [getRemoteURL](./Script.md#getremoteurl)

## Constructors

### constructor

• **new Script**(`scriptId`, `caller`, `locator`, `cache?`)

Constructs new representation of a script.

**`internal`**

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `scriptId` | `string` | `undefined` | - |
| `caller` | `undefined` \| `string` | `undefined` | - |
| `locator` | [`NormalizedScriptLocator`](../interfaces/NormalizedScriptLocator.md) | `undefined` | Normalized locator data. |
| `cache` | `boolean` | `true` | Flag whether use cache or not, `true` by default. |

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:131](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L131)

## Properties

### cache

• `Readonly` **cache**: `boolean` = `true`

___

### caller

• `Readonly` **caller**: `undefined` \| `string`

___

### locator

• `Readonly` **locator**: [`NormalizedScriptLocator`](../interfaces/NormalizedScriptLocator.md)

___

### scriptId

• `Readonly` **scriptId**: `string`

___

### DEFAULT\_TIMEOUT

▪ `Static` **DEFAULT\_TIMEOUT**: `number` = `30000`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:20](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L20)

## Methods

### checkIfCacheDataOutdated

▸ **checkIfCacheDataOutdated**(`cachedData`): `boolean`

Check if previous cached data is the same as the new one.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cachedData` | `Pick`<[`NormalizedScriptLocator`](../interfaces/NormalizedScriptLocator.md), ``"method"`` \| ``"url"`` \| ``"query"`` \| ``"headers"`` \| ``"body"``\> | Cached data for the same script. |

#### Returns

`boolean`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:186](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L186)

___

### getCacheData

▸ **getCacheData**(): `Object`

Get object to store in cache.

**`internal`**

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `body` | `undefined` \| `string` |
| `headers` | `undefined` \| `Record`<`string`, `string`\> |
| `method` | ``"GET"`` \| ``"POST"`` |
| `query` | `undefined` \| `string` |
| `url` | `string` |

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:208](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L208)

___

### shouldRefetch

▸ **shouldRefetch**(`cachedData`): `boolean`

Check if the script should be fetched again or reused,
based on previous cached data.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cachedData` | `Pick`<[`NormalizedScriptLocator`](../interfaces/NormalizedScriptLocator.md), ``"method"`` \| ``"url"`` \| ``"query"`` \| ``"headers"`` \| ``"body"``\> | Cached data for the same script. |

#### Returns

`boolean`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:166](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L166)

___

### shouldUpdateCache

▸ **shouldUpdateCache**(`cachedData`): `boolean`

Check if the script was already cached and cache should be updated with new data.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `cachedData` | `Pick`<[`NormalizedScriptLocator`](../interfaces/NormalizedScriptLocator.md), ``"method"`` \| ``"url"`` \| ``"query"`` \| ``"headers"`` \| ``"body"``\> | Cached data for the same script. |

#### Returns

`boolean`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:145](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L145)

___

### toObject

▸ **toObject**(): `Object`

#### Returns

`Object`

| Name | Type |
| :------ | :------ |
| `cache` | `boolean` |
| `caller` | `undefined` \| `string` |
| `locator` | [`NormalizedScriptLocator`](../interfaces/NormalizedScriptLocator.md) |
| `scriptId` | `string` |

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:218](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L218)

___

### from

▸ `Static` **from**(`key`, `locator`, `fetch`): [`Script`](./Script.md)

Create new instance of `Script` from non-normalized script locator data.

**`internal`**

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `Object` | - |
| `key.caller?` | `string` | - |
| `key.scriptId` | `string` | - |
| `locator` | [`ScriptLocator`](../interfaces/ScriptLocator.md) | Non-normalized locator data. |
| `fetch` | `boolean` | Initial flag for whether script should be fetched or not. |

#### Returns

[`Script`](./Script.md)

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:70](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L70)

___

### getDevServerURL

▸ `Static` **getDevServerURL**(`scriptId`): (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string`

Get URL of a script hosted on development server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId` | `string` | Id of the script. |

#### Returns

`fn`

▸ (`webpackContext`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `webpackContext` | [`WebpackContext`](../interfaces/WebpackContext.md) |

##### Returns

`string`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:27](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L27)

___

### getFileSystemURL

▸ `Static` **getFileSystemURL**(`scriptId`): (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string`

Get URL of a script stored on filesystem on the target mobile device.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId` | `string` | Id of the script. |

#### Returns

`fn`

▸ (`webpackContext`): `string`

##### Parameters

| Name | Type |
| :------ | :------ |
| `webpackContext` | [`WebpackContext`](../interfaces/WebpackContext.md) |

##### Returns

`string`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:37](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L37)

___

### getRemoteURL

▸ `Static` **getRemoteURL**(`url`, `options?`): `string` \| (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string`

Get URL of a script hosted on a remote server.

By default `.chunk.bundle` extension will be added to the URL.
If your script has different extension, you should pass `{ excludeExtension: true }` as 2nd argument.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | A URL to remote location where the script is stored. |
| `options` | `Object` | Additional options. |
| `options.excludeExtension?` | `boolean` | - |

#### Returns

`string` \| (`webpackContext`: [`WebpackContext`](../interfaces/WebpackContext.md)) => `string`

#### Defined in

[packages/repack/src/modules/ScriptManager/Script.ts:51](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/Script.ts#L51)
