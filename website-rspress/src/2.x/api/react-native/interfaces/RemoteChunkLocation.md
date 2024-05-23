# Interface: RemoteChunkLocation

Interface specifying how to fetch a remote chunk.
It represents the output of [RemoteChunkResolver](../types/RemoteChunkResolver.md) function used by [ChunkManager](../classes/ChunkManager.md).

## Table of contents

### Properties

- [absolute](./RemoteChunkLocation.md#absolute)
- [body](./RemoteChunkLocation.md#body)
- [excludeExtension](./RemoteChunkLocation.md#excludeextension)
- [headers](./RemoteChunkLocation.md#headers)
- [method](./RemoteChunkLocation.md#method)
- [query](./RemoteChunkLocation.md#query)
- [timeout](./RemoteChunkLocation.md#timeout)
- [url](./RemoteChunkLocation.md#url)

## Properties

### absolute

• `Optional` **absolute**: `boolean`

Flag indicating whether the URL is an absolute FileSystem URL on a target device.
Useful if you're using custom code to download the chunk and you want `ChunkManager` to
execute it only from a custom FileSystem path.
Defaults to `false`.

#### Defined in

[types.ts:80](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L80)

___

### body

• `Optional` **body**: ``null`` \| `string` \| `URLSearchParams` \| `FormData`

HTTP body for a remote chunk's fetch request.

When passing `body`, make sure the `method` is set to `POST` and a correct
`content-type` header is provided.

Changing this field for the same chunk, will cause cache invalidation for that chunk
and a fresh version will be downloaded.

#### Defined in

[types.ts:65](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L65)

___

### excludeExtension

• `Optional` **excludeExtension**: `boolean`

Whether not to add chunk's default extension by default. If your chunk has different
extension than `.chunk.bundle` you should set this flag to `true` and add extension to the `url`.

#### Defined in

[types.ts:25](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L25)

___

### headers

• `Optional` **headers**: `Record`<`string`, `string`\> \| `Headers`

Headers to pass to a remote chunk's fetch request.

When passing `body`, make sure add content `content-type` header, otherwise `text/plain`
will be used.

Changing this field for the same chunk, will cause cache invalidation for that chunk
and a fresh version will be downloaded.

#### Defined in

[types.ts:44](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L44)

___

### method

• `Optional` **method**: ``"GET"`` \| ``"POST"``

HTTP method used to fetch remote chunk.

Passing `body` with method `GET` is a no-op. Use `POST` to send `body` data.

Changing this field for the same chunk, will cause cache invalidation for that chunk
and a fresh version will be downloaded.

#### Defined in

[types.ts:54](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L54)

___

### query

• `Optional` **query**: `string` \| `Record`<`string`, `string`\> \| `URLSearchParams`

Query params to append when building the final URL.

Changing this field for the same chunk, will cause cache invalidation for that chunk
and a fresh version will be downloaded.

#### Defined in

[types.ts:33](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L33)

___

### timeout

• `Optional` **timeout**: `number`

Custom timeout for chunk fetch requests. Defaults to 30s.
On iOS this `timeout` is used as a `timeoutInterval`
On Android this `timeout` is used as a `readTimeout` and `connectionTimeout`.

#### Defined in

[types.ts:72](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L72)

___

### url

• **url**: `string`

A path-only URL to remote location, where to download a chunk from.

Changing this field for the same chunk, will cause cache invalidation for that chunk
and a fresh version will be downloaded.

Example: for `chunkId: 'TeacherModule'` the `url` can look like this:
`https://myapp.com/assets/TeacherModule`.

**Passing query params might lead to unexpected results. To pass query params use `query` field.**

#### Defined in

[types.ts:19](https://github.com/callstack/repack/blob/a78f6b9/packages/repack/src/client/api/types.ts#L19)
