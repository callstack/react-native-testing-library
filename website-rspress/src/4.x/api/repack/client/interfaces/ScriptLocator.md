# Interface: ScriptLocator

Interface specifying how to fetch a script.
It represents the output of [ScriptLocatorResolver](../types/ScriptLocatorResolver.md) function used by [ScriptManager](../classes/ScriptManager.md).

## Table of contents

### Properties

- [absolute](./ScriptLocator.md#absolute)
- [body](./ScriptLocator.md#body)
- [cache](./ScriptLocator.md#cache)
- [headers](./ScriptLocator.md#headers)
- [method](./ScriptLocator.md#method)
- [query](./ScriptLocator.md#query)
- [timeout](./ScriptLocator.md#timeout)
- [url](./ScriptLocator.md#url)
- [verifyScriptSignature](./ScriptLocator.md#verifyscriptsignature)

### Methods

- [shouldUpdateScript](./ScriptLocator.md#shouldupdatescript)

## Properties

### absolute

• `Optional` **absolute**: `boolean`

Flag indicating whether the URL is an absolute FileSystem URL on a target device.
Useful if you're using custom code to download the script and you want `ScriptManager` to
execute it only from a custom FileSystem path.
Defaults to `false`.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:79](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L79)

___

### body

• `Optional` **body**: ``null`` \| `string` \| `FormData` \| `URLSearchParams`

HTTP body for a script's fetch request.

When passing `body`, make sure the `method` is set to `POST` and a correct
`content-type` header is provided.

Changing this field for the same script, will cause cache invalidation for that script
and a fresh version will be downloaded.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:64](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L64)

___

### cache

• `Optional` **cache**: `boolean`

Flag to disable script caching. By default set to `true`.

When `true` (default), it will compare method, url, query, headers and body of
previous (if there was) attempt to load the same script. If none of them changed, it
will NOT download a new copy of the script, but instead, it will only execute previously
downloaded script.
Setting this flat to `false`, disables that behavior.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:90](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L90)

___

### headers

• `Optional` **headers**: `Record`<`string`, `string`\> \| `Headers`

Headers to pass to a script's fetch request.

When passing `body`, make sure add content `content-type` header, otherwise `text/plain`
will be used.

Changing this field for the same script, will cause cache invalidation for that script
and a fresh version will be downloaded.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:43](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L43)

___

### method

• `Optional` **method**: ``"GET"`` \| ``"POST"``

HTTP method used to fetch script.

Passing `body` with method `GET` is a no-op. Use `POST` to send `body` data.

Changing this field for the same script, will cause cache invalidation for that script
and a fresh version will be downloaded.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:53](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L53)

___

### query

• `Optional` **query**: `string` \| `Record`<`string`, `string`\> \| `URLSearchParams`

Query params to append when building the final URL.

Changing this field for the same script, will cause cache invalidation for that script
and a fresh version will be downloaded.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:32](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L32)

___

### timeout

• `Optional` **timeout**: `number`

Custom timeout for script fetch requests. Defaults to 30s.
On iOS this `timeout` is used as a `timeoutInterval`
On Android this `timeout` is used as a `readTimeout` and `connectionTimeout`.

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:71](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L71)

___

### url

• **url**: `string` \| (`webpackContext`: [`WebpackContext`](./WebpackContext.md)) => `string`

A path-only URL to remote location, where to download a script from.

Changing this field for the same script, will cause cache invalidation for that script
and a fresh version will be downloaded.

Example: for `scriptId: 'TeacherModule'` the `url` can look like this:
`https://myapp.com/assets/TeacherModule`.

**Passing query params might lead to unexpected results. To pass query params use `query` field.**

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:24](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L24)

___

### verifyScriptSignature

• `Optional` **verifyScriptSignature**: ``"strict"`` \| ``"lax"`` \| ``"off"``

Flag to enable script's code-signature verification. By default set to `none`

`strict` means that the script's code-signature will be verfied regardless of the signature being present in the bundle
`lax` means that the script's code-signature will be verfied only when the signature is present in the bundle
 if the signature is not present in the bundle, the script will be loaded without verification
`off` means that the script's code-signature will not be verfied

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:100](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L100)

## Methods

### shouldUpdateScript

▸ `Optional` **shouldUpdateScript**(`scriptId?`, `caller?`, `isScriptCacheOutdated?`): `boolean` \| `Promise`<`boolean`\>

Function called before loading or getting from the cache and after resolving the script locator.
It's an async function which should return a boolean indicating whether the script should be loaded or use default behaviour.
This is useful when you want to load a script only when certain conditions are met
(e.g. ask user if they want to update/download new version of the script)

When `true` is returned, the script will be loaded from the network.
When `false` is returned, the script will be loaded from the cache.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId?` | `string` | Id of the script to resolve. |
| `caller?` | `string` | Name of the calling script - it can be for example: name of the bundle, chunk or container. |
| `isScriptCacheOutdated?` | `boolean` | Boolean indicating whether the script cache is outdated or not. It's `true` when the script cache is outdated and `false` when the script cache is up to date or there is no cache for the script. Outdated cache means that the script was previously downloaded and put into cache, but the script locator data (method, url, query, headers, or body) has changed since then. |

#### Returns

`boolean` \| `Promise`<`boolean`\>

Boolean indicating whether the script should be loaded or not

#### Defined in

[packages/repack/src/modules/ScriptManager/types.ts:118](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/types.ts#L118)
