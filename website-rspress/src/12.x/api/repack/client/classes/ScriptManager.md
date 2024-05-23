# Class: ScriptManager

A manager to ease resolution, downloading and executing additional code from:
- arbitrary JavaScript scripts
- Webpack chunks
- Webpack bundles
- Webpack MF containers

ScriptManager is globally available under `ScriptManager.shared` in main bundle, chunks and containers.

Use `ScriptManager.shared` instead of creating new instance of `ScriptManager`.

This API is mainly useful, if you are working with any form of Code Splitting.

`ScriptManager` is also an `EventEmitter` and emits the following events:
- `resolving` with `{ scriptId, caller }`
- `resolved` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
- `prefetching` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
- `loading` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
- `loaded` with `scriptId: string, caller?: string, locator: NormalizedScriptLocator, cache: boolean`
- `error` with `error: Error`

Example of using this API with async Webpack chunk:
```js
import * as React from 'react';
import { ScriptManager, Script } from '@callstack/repack/client';

ScriptManager.shared.addResolver(async (scriptId) => {
  if (__DEV__) {
    return {
      url: Script.getDevServerURL(scriptId);
      cache: false,
    };
  }

  return {
    url: Script.getRemoteURL(`http://domain.exaple/apps/${scriptId}`),
  };
});

// ScriptManager.shared.loadScript is called internally when running `import()`
const TeacherModule = React.lazy(() => import('./Teacher.js'));
const StudentModule = React.lazy(() => import('./Student.js'));

export function App({ role }) {
  if (role === 'teacher') {
    return <TeacherModule />;
  }

  return <StudentModule />
}
```

## Hierarchy

- `EventEmitter`

  ↳ **`ScriptManager`**

## Table of contents

### Constructors

- [constructor](./ScriptManager.md#constructor)

### Properties

- [cache](./ScriptManager.md#cache)
- [cacheInitialized](./ScriptManager.md#cacheinitialized)
- [resolvers](./ScriptManager.md#resolvers)
- [storage](./ScriptManager.md#storage)
- [captureRejectionSymbol](./ScriptManager.md#capturerejectionsymbol)
- [captureRejections](./ScriptManager.md#capturerejections)
- [defaultMaxListeners](./ScriptManager.md#defaultmaxlisteners)
- [errorMonitor](./ScriptManager.md#errormonitor)

### Accessors

- [shared](./ScriptManager.md#shared)

### Methods

- [\_\_destroy](./ScriptManager.md#__destroy)
- [addListener](./ScriptManager.md#addlistener)
- [addResolver](./ScriptManager.md#addresolver)
- [emit](./ScriptManager.md#emit)
- [eventNames](./ScriptManager.md#eventnames)
- [getMaxListeners](./ScriptManager.md#getmaxlisteners)
- [handleError](./ScriptManager.md#handleerror)
- [initCache](./ScriptManager.md#initcache)
- [invalidateScripts](./ScriptManager.md#invalidatescripts)
- [listenerCount](./ScriptManager.md#listenercount)
- [listeners](./ScriptManager.md#listeners)
- [loadScript](./ScriptManager.md#loadscript)
- [off](./ScriptManager.md#off)
- [on](./ScriptManager.md#on)
- [once](./ScriptManager.md#once)
- [prefetchScript](./ScriptManager.md#prefetchscript)
- [prependListener](./ScriptManager.md#prependlistener)
- [prependOnceListener](./ScriptManager.md#prependoncelistener)
- [rawListeners](./ScriptManager.md#rawlisteners)
- [removeAllListeners](./ScriptManager.md#removealllisteners)
- [removeAllResolvers](./ScriptManager.md#removeallresolvers)
- [removeListener](./ScriptManager.md#removelistener)
- [removeResolver](./ScriptManager.md#removeresolver)
- [resolveScript](./ScriptManager.md#resolvescript)
- [saveCache](./ScriptManager.md#savecache)
- [setMaxListeners](./ScriptManager.md#setmaxlisteners)
- [setStorage](./ScriptManager.md#setstorage)
- [listenerCount](./ScriptManager.md#listenercount-1)
- [on](./ScriptManager.md#on-1)
- [once](./ScriptManager.md#once-1)

## Constructors

### constructor

• `Protected` **new ScriptManager**(`nativeScriptManager?`)

Constructs instance of `ScriptManager`.

__Should not be called directly__ - use `ScriptManager.shared`.

**`internal`**

#### Parameters

| Name | Type | Default value |
| :------ | :------ | :------ |
| `nativeScriptManager` | `any` | `NativeModules.ScriptManager` |

#### Overrides

EventEmitter.constructor

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:103](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L103)

## Properties

### cache

• `Protected` **cache**: `Cache` = `{}`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:91](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L91)

___

### cacheInitialized

• `Protected` **cacheInitialized**: `boolean` = `false`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:92](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L92)

___

### resolvers

• `Protected` **resolvers**: [`number`, [`ScriptLocatorResolver`](../types/ScriptLocatorResolver.md)][] = `[]`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:93](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L93)

___

### storage

• `Protected` `Optional` **storage**: [`StorageApi`](../interfaces/StorageApi.md)

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:94](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L94)

___

### captureRejectionSymbol

▪ `Static` `Readonly` **captureRejectionSymbol**: typeof [`captureRejectionSymbol`](./ScriptManager.md#capturerejectionsymbol)

#### Inherited from

EventEmitter.captureRejectionSymbol

#### Defined in

node_modules/@types/node/events.d.ts:38

___

### captureRejections

▪ `Static` **captureRejections**: `boolean`

Sets or gets the default captureRejection value for all emitters.

#### Inherited from

EventEmitter.captureRejections

#### Defined in

node_modules/@types/node/events.d.ts:44

___

### defaultMaxListeners

▪ `Static` **defaultMaxListeners**: `number`

#### Inherited from

EventEmitter.defaultMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:45

___

### errorMonitor

▪ `Static` `Readonly` **errorMonitor**: typeof [`errorMonitor`](./ScriptManager.md#errormonitor)

This symbol shall be used to install a listener for only monitoring `'error'`
events. Listeners installed using this symbol are called before the regular
`'error'` listeners are called.

Installing a listener using this symbol does not change the behavior once an
`'error'` event is emitted, therefore the process will still crash if no
regular `'error'` listener is installed.

#### Inherited from

EventEmitter.errorMonitor

#### Defined in

node_modules/@types/node/events.d.ts:37

## Accessors

### shared

• `Static` `get` **shared**(): [`ScriptManager`](./ScriptManager.md)

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:84](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L84)

## Methods

### \_\_destroy

▸ **__destroy**(): `void`

#### Returns

`void`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:138](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L138)

___

### addListener

▸ **addListener**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.addListener

#### Defined in

node_modules/@types/node/events.d.ts:57

___

### addResolver

▸ **addResolver**(`resolver`, `options?`): `void`

Adds new script locator resolver.

Resolver is an async function to resolve script locator data - in other words, it's a function to
tell the [ScriptManager](./ScriptManager.md) how to fetch the script.

There's no limitation on what logic you can run inside this function - it can include:
- fetching/loading remote config
- fetching/loading feature flags
- fetching/loading A/B testing data
- calling native modules
- running arbitrary logic

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolver` | [`ScriptLocatorResolver`](../types/ScriptLocatorResolver.md) | Resolver function to add. |
| `options` | [`ResolverOptions`](../interfaces/ResolverOptions.md) | Resolver options. |

#### Returns

`void`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:174](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L174)

___

### emit

▸ **emit**(`event`, ...`args`): `boolean`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `...args` | `any`[] |

#### Returns

`boolean`

#### Inherited from

EventEmitter.emit

#### Defined in

node_modules/@types/node/events.d.ts:67

___

### eventNames

▸ **eventNames**(): (`string` \| `symbol`)[]

#### Returns

(`string` \| `symbol`)[]

#### Inherited from

EventEmitter.eventNames

#### Defined in

node_modules/@types/node/events.d.ts:72

___

### getMaxListeners

▸ **getMaxListeners**(): `number`

#### Returns

`number`

#### Inherited from

EventEmitter.getMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:64

___

### handleError

▸ `Protected` **handleError**(`error`, `message`, ...`args`): `never`

#### Parameters

| Name | Type |
| :------ | :------ |
| `error` | `any` |
| `message` | `string` |
| `...args` | `any`[] |

#### Returns

`never`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:220](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L220)

___

### initCache

▸ `Protected` **initCache**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:206](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L206)

___

### invalidateScripts

▸ **invalidateScripts**(`scriptIds?`): `Promise`<`void`\>

Clears the cache (if configured in [ScriptManager.setStorage](./ScriptManager.md#setstorage)) and removes downloaded
files for given scripts from the filesystem. This function can be awaited to detect if the
scripts were invalidated and for error handling.

Use `ScriptManager.shared.on('invalidated', (scriptIds) => { })` to listen for when
the invalidation completes.

#### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `scriptIds` | `string`[] | `[]` | Array of script ids to clear from cache and remove from filesystem. |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:410](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L410)

___

### listenerCount

▸ **listenerCount**(`event`): `number`

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:68

___

### listeners

▸ **listeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.listeners

#### Defined in

node_modules/@types/node/events.d.ts:65

___

### loadScript

▸ **loadScript**(`scriptId`, `caller?`, `webpackContext?`): `Promise`<`void`\>

Resolves given script's location, downloads and executes it.
The execution of the code is handled internally by threading in React Native.

Use `ScriptManager.shared.on('loading', (script) => { })` to listen for when
the script is about to be loaded.

Use `ScriptManager.shared.on('loaded', (script) => { })` to listen for when
the script is loaded.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId` | `string` | Id of the script to load. |
| `caller?` | `string` | Name of the calling script - it can be for example: name of the bundle, chunk or container. |
| `webpackContext` | [`WebpackContext`](../interfaces/WebpackContext.md) | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:333](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L333)

___

### off

▸ **off**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.off

#### Defined in

node_modules/@types/node/events.d.ts:61

___

### on

▸ **on**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:58

___

### once

▸ **once**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:59

___

### prefetchScript

▸ **prefetchScript**(`scriptId`, `caller?`, `webpackContext?`): `Promise`<`void`\>

Resolves given script's location and downloads it without executing.
This function can be awaited to detect if the script was downloaded and for error handling.

Use `ScriptManager.shared.on('prefetching', (script) => { })` to listen for when
the script's prefetch beings.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId` | `string` | Id of the script to prefetch. |
| `caller?` | `string` | Name of the calling script - it can be for example: name of the bundle, chunk or container. |
| `webpackContext` | [`WebpackContext`](../interfaces/WebpackContext.md) | - |

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:379](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L379)

___

### prependListener

▸ **prependListener**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.prependListener

#### Defined in

node_modules/@types/node/events.d.ts:70

___

### prependOnceListener

▸ **prependOnceListener**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.prependOnceListener

#### Defined in

node_modules/@types/node/events.d.ts:71

___

### rawListeners

▸ **rawListeners**(`event`): `Function`[]

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |

#### Returns

`Function`[]

#### Inherited from

EventEmitter.rawListeners

#### Defined in

node_modules/@types/node/events.d.ts:66

___

### removeAllListeners

▸ **removeAllListeners**(`event?`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event?` | `string` \| `symbol` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.removeAllListeners

#### Defined in

node_modules/@types/node/events.d.ts:62

___

### removeAllResolvers

▸ **removeAllResolvers**(): `void`

Removes all previously added resolvers.

#### Returns

`void`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:202](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L202)

___

### removeListener

▸ **removeListener**(`event`, `listener`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `event` | `string` \| `symbol` |
| `listener` | (...`args`: `any`[]) => `void` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.removeListener

#### Defined in

node_modules/@types/node/events.d.ts:60

___

### removeResolver

▸ **removeResolver**(`resolver`): `boolean`

Removes previously added resolver.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `resolver` | [`ScriptLocatorResolver`](../types/ScriptLocatorResolver.md) | Resolver function to remove. |

#### Returns

`boolean`

`true` if resolver was found and removed, `false` otherwise.

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:189](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L189)

___

### resolveScript

▸ **resolveScript**(`scriptId`, `caller?`, `webpackContext?`): `Promise`<[`Script`](./Script.md)\>

Resolves a [Script](./Script.md) instance with normalized locator data.

Resolution will use previously added (via `ScriptManager.shared.addResolver(...)`) resolvers
in series, util one returns a locator data or will throw if no resolver handled the request.

Use `ScriptManager.shared.on('resolving', ({ scriptId, caller }) => { })` to listen for when
the script resolution begins.

Use `ScriptManager.shared.on('resolved', (script) => { })` to listen for when
the script's locator data is resolved.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `scriptId` | `string` | Id of the script to resolve. |
| `caller?` | `string` | Name of the calling script - it can be for example: name of the bundle, chunk or container. |
| `webpackContext` | [`WebpackContext`](../interfaces/WebpackContext.md) | - |

#### Returns

`Promise`<[`Script`](./Script.md)\>

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:241](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L241)

___

### saveCache

▸ `Protected` **saveCache**(): `Promise`<`void`\>

#### Returns

`Promise`<`void`\>

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:216](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L216)

___

### setMaxListeners

▸ **setMaxListeners**(`n`): [`ScriptManager`](./ScriptManager.md)

#### Parameters

| Name | Type |
| :------ | :------ |
| `n` | `number` |

#### Returns

[`ScriptManager`](./ScriptManager.md)

#### Inherited from

EventEmitter.setMaxListeners

#### Defined in

node_modules/@types/node/events.d.ts:63

___

### setStorage

▸ **setStorage**(`storage?`): `void`

Sets a storage backend to cache resolved scripts locator data.

The stored data is used to detect if scripts locator data of previously downloaded
script hasn't changed to avoid over-fetching the script.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `storage?` | [`StorageApi`](../interfaces/StorageApi.md) | Implementation of storage functions. |

#### Returns

`void`

#### Defined in

[packages/repack/src/modules/ScriptManager/ScriptManager.ts:154](https://github.com/callstack/repack/blob/1d9a1bb/packages/repack/src/modules/ScriptManager/ScriptManager.ts#L154)

___

### listenerCount

▸ `Static` **listenerCount**(`emitter`, `event`): `number`

**`deprecated`** since v4.0.0

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` \| `symbol` |

#### Returns

`number`

#### Inherited from

EventEmitter.listenerCount

#### Defined in

node_modules/@types/node/events.d.ts:26

___

### on

▸ `Static` **on**(`emitter`, `event`): `AsyncIterableIterator`<`any`\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `EventEmitter` |
| `event` | `string` |

#### Returns

`AsyncIterableIterator`<`any`\>

#### Inherited from

EventEmitter.on

#### Defined in

node_modules/@types/node/events.d.ts:23

___

### once

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `NodeEventTarget` |
| `event` | `string` \| `symbol` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:21

▸ `Static` **once**(`emitter`, `event`): `Promise`<`any`[]\>

#### Parameters

| Name | Type |
| :------ | :------ |
| `emitter` | `DOMEventTarget` |
| `event` | `string` |

#### Returns

`Promise`<`any`[]\>

#### Inherited from

EventEmitter.once

#### Defined in

node_modules/@types/node/events.d.ts:22
