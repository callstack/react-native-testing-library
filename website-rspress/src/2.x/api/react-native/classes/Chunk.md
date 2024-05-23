# Class: Chunk

A helper class to ease the creation of of chunk based on it's location.

**You should not need to use this.**

**`internal`**

## Table of contents

### Constructors

- [constructor](./Chunk.md#constructor)

### Methods

- [fromDevServer](./Chunk.md#fromdevserver)
- [fromFileSystem](./Chunk.md#fromfilesystem)
- [fromRemote](./Chunk.md#fromremote)

## Constructors

### constructor

• **new Chunk**()

## Methods

### fromDevServer

▸ `Static` **fromDevServer**(`chunkId`): `string`

Creates definition for a chunk hosted on development server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunkId` | `string` | Id of the chunk. |

#### Returns

`string`

Chunk definition.

#### Defined in

[Chunk.ts:17](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/Chunk.ts#L17)

___

### fromFileSystem

▸ `Static` **fromFileSystem**(`chunkId`): `string`

Creates definition for a chunk stored on filesystem on the target mobile device.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `chunkId` | `string` | Id of the chunk. |

#### Returns

`string`

Chunk definition.

#### Defined in

[Chunk.ts:29](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/Chunk.ts#L29)

___

### fromRemote

▸ `Static` **fromRemote**(`url`, `options?`): `string`

Creates definition for a chunk hosted on a remote server.

#### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `url` | `string` | A URL to remote location where the chunk is stored. |
| `options` | `Object` | Additional options. |
| `options.excludeExtension?` | `boolean` | - |

#### Returns

`string`

Chunk definition.

#### Defined in

[Chunk.ts:40](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/Chunk.ts#L40)
